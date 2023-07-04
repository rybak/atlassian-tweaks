// ==UserScript==
// @name         Bitbucket: copy commit reference
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      2
// @description  Adds a "Copy commit reference" link to every commit page.
// @author       Andrei Rybak
// @include      https://*bitbucket*/*/commits/*
// @match        https://bitbucket.example.com/*/commits/*
// @match        https://bitbucket.org/*/commits/*
// @icon         https://bitbucket.org/favicon.ico
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2023 Andrei Rybak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * Public commits to test Bitbucket Cloud:
 * - Regular commit with Jira issue
 *   https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/1e7277348eb3f7b1dc07b4cc035a6d82943a410f
 * - Merge commit with PR mention
 *   https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/7dbe5402633c593021de6bf203278e2c6599c953
 * - Merge commit with mentions of Jira issue and PR
 *   https://bitbucket.org/andreyrybak/atlassian-tweaks/commits/19ca4f537e454e15f4e3bf1f88ebc43c0e9c559a
 */

(function() {
	'use strict';

	const LOG_PREFIX = '[Bitbucket: copy commit reference]:';
	const CONTAINER_ID = "BBCCR_container";

	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	function warn(...toLog) {
		console.warn(LOG_PREFIX, ...toLog);
	}

	function log(...toLog) {
		console.log(LOG_PREFIX, ...toLog);
	}

	function debug(...toLog) {
		console.debug(LOG_PREFIX, ...toLog);
	}

	/*
	 * Detects the kind of Bitbucket, invokes corresponding function:
	 * `serverFn` or `cloudFn`, and returns result of the invocation.
	 */
	function onVersion(serverFn, cloudFn) {
		if (document.querySelector('meta[name="bb-single-page-app"]') == null) {
			return serverFn();
		}
		const b = document.body;
		const auiVersion = b.getAttribute('data-aui-version');
		if (!auiVersion) {
			return cloudFn();
		}
		if (auiVersion.startsWith('7.')) {
			/*
			 * This is weird, but unlike for Jira Server vs Jira Cloud,
			 * Bitbucket Cloud's AUI version is smaller than AUI version
			 * of current-ish Bitbucket Server.
			 */
			return cloudFn();
		}
		if (auiVersion.startsWith('9.')) {
			return serverFn();
		}
		// TODO more ways of detecting the kind of Bitbucket
		cloudFn();
	}

	/*
	 * Extracts the first line of the commit message.
	 * If the first line is too small, extracts more lines.
	 */
	function commitMessageToSubject(commitMessage) {
		const lines = commitMessage.split('\n');
		if (lines[0].length > 16) {
			/*
			 * Most common use-case: a normal commit message with
			 * a normal-ish subject line.
			 */
			return lines[0].trim();
		}
		/*
		 * The `if`s below handle weird commit messages I have
		 * encountered in the wild.
		 */
		if (lines.length < 2) {
			return lines[0].trim();
		}
		if (lines[1].length == 0) {
			return lines[0].trim();
		}
		// sometimes subject is weirdly split across two lines
		return lines[0].trim() + " " + lines[1].trim();
	}

	function abbreviateCommitId(commitId) {
		return commitId.slice(0, 7)
	}

	/*
	 * Formats given commit metadata as a commit reference according
	 * to `git log --format=reference`.  See format descriptions at
	 * https://git-scm.com/docs/git-log#_pretty_formats
	 */
	function plainTextCommitReference(commitId, subject, dateIso) {
		const abbrev = abbreviateCommitId(commitId);
		return `${abbrev} (${subject}, ${dateIso})`;
	}

	/*
	 * Extracts Jira issue keys from the Bitbucket UI.
	 * Works only in Bitbucket Server so far.
	 * Not needed for Bitbucket Cloud, which uses a separate REST API
	 * request to provide the HTML content for the clipboard.
	 */
	function getIssueKeys() {
		const issuesElem = document.querySelector('.plugin-section-primary .commit-issues-trigger');
		if (!issuesElem) {
			return [];
		}
		const issueKeys = issuesElem.getAttribute('data-issue-keys').split(',');
		return issueKeys;
	}

	/*
	 * Returns the URL to a Jira issue for given key of the Jira issue.
	 * Uses Bitbucket's REST API for Jira integration (not Jira API).
	 * A Bitbucket instance may be connected to several Jira instances
	 * and Bitbucket doesn't know for which Jira instance a particular
	 * issue mentioned in the commit belongs.
	 */
	async function getIssueUrl(issueKey) {
		const projectKey = document.querySelector('[data-projectkey]').getAttribute('data-projectkey');
		/*
		 * This URL for REST API doesn't seem to be documented.
		 * For example, `jira-integration` isn't mentioned in
		 * https://docs.atlassian.com/bitbucket-server/rest/7.21.0/bitbucket-jira-rest.html
		 *
		 * I've found out about it by checking what Bitbucket
		 * Server's web UI does when clicking on the Jira
		 * integration link on a commit's page.
		 */
		const response = await fetch(`${document.location.origin}/rest/jira-integration/latest/issues?issueKey=${issueKey}&entityKey=${projectKey}&fields=url&minimum=10`);
		const data = await response.json();
		return data[0].url;
	}

	async function insertJiraLinks(text) {
		const issueKeys = getIssueKeys();
		if (issueKeys.length == 0) {
			return text;
		}
		debug("issueKeys:", issueKeys);
		for (const issueKey of issueKeys) {
			if (text.includes(issueKey)) {
				try {
					const issueUrl = await getIssueUrl(issueKey);
					text = text.replace(issueKey, `<a href="${issueUrl}">${issueKey}</a>`);
				} catch(e) {
					warn(`Cannot load Jira URL from REST API for issue ${issueKey}`, e);
				}
			}
		}
		return text;
	}

	function getProjectKey() {
		return document.querySelector('[data-project-key]').getAttribute('data-project-key');
	}

	function getRepositorySlug() {
		return document.querySelector('[data-repository-slug]').getAttribute('data-repository-slug');
	}

	/*
	 * Loads from REST API the pull requests, which involve the given commit.
	 *
	 * Tested only on Bitbucket Server.
	 * Shouldn't be used on Bitbucket Cloud, because of the extra request
	 * for HTML of the commit message.
	 */
	async function getPullRequests(commitId) {
		const projectKey = getProjectKey();
		const repoSlug = getRepositorySlug();
		const url = `/rest/api/latest/projects/${projectKey}/repos/${repoSlug}/commits/${commitId}/pull-requests?start=0&limit=25`;
		try {
			const response = await fetch(url);
			const obj = await response.json();
			return obj.values;
		} catch (e) {
			error(`Cannot getPullRequests url="${url}"`, e);
			return [];
		}
	}

	/*
	 * Inserts an HTML anchor to link to the pull requests, which are
	 * mentioned in the provided `text` in the format that is used by
	 * Bitbucket's default automatic merge commit messages.
	 *
	 * Tested only on Bitbucket Server.
	 * Shouldn't be used on Bitbucket Cloud, because of the extra request
	 * for HTML of the commit message.
	 */
	async function insertPrLinks(text, commitId) {
		if (!text.toLowerCase().includes('pull request')) {
			return text;
		}
		try {
			const prs = await getPullRequests(commitId);
			/*
			 * Find the PR ID in the text.
			 * Assume that there should be only one.
			 */
			const m = new RegExp('pull request [#](\\d+)', 'gmi').exec(text);
			if (m.length != 2) {
				return text;
			}
			const linkText = m[0];
			const id = parseInt(m[1]);
			for (const pr of prs) {
				if (pr.id == id) {
					const prUrl = pr.links.self[0].href;
					text = text.replace(linkText, `<a href="${prUrl}">${linkText}</a>`);
					break;
				}
			}
			return text;
		} catch (e) {
			error("Cannot insert pull request links", e);
			return text;
		}
	}

	/*
	 * Extracts first <p> tag out of the provided `html`.
	 */
	function firstHtmlParagraph(html) {
		const OPEN_P_TAG = '<p>';
		const CLOSE_P_TAG = '</p>';
		const startP = html.indexOf(OPEN_P_TAG);
		const endP = html.indexOf(CLOSE_P_TAG);
		if (startP < 0 || endP < 0) {
			return html;
		}
		return html.slice(startP + OPEN_P_TAG.length, endP);
	}

	/*
	 * Renders given commit that has the provided subject line and date
	 * in reference format as HTML content, which includes clickable
	 * links to commits, pull requests, and Jira issues.
	 *
	 * Parameter `htmlSubject`:
	 *     Pre-rendered HTML of the subject line of the commit. Optional.
	 *
	 * Documentation of formats: https://git-scm.com/docs/git-log#_pretty_formats
	 */
	async function htmlSyntaxLink(commitId, subject, dateIso, htmlSubject) {
		const url = document.location.href;
		const abbrev = abbreviateCommitId(commitId);
		let subjectHtml;
		if (htmlSubject && htmlSubject.length > 0) {
			subjectHtml = htmlSubject;
		} else {
			subjectHtml = await insertPrLinks(await insertJiraLinks(subject), commitId);
		}
		debug("subjectHtml", subjectHtml);
		const html = `<a href="${url}">${abbrev}</a> (${subjectHtml}, ${dateIso})`;
		return html;
	}

	function addLinkToClipboard(event, plainText, html) {
		event.stopPropagation();
		event.preventDefault();

		let clipboardData = event.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', plainText);
		clipboardData.setData('text/html', html);
	}

	/*
	 * Generates the content and passes it to the clipboard.
	 *
	 * Async, because we need to access Jira integration via REST API
	 * to generate the fancy HTML, with links to Jira.
	 */
	async function copyClickAction(event) {
		event.preventDefault();
		try {
			/*
			 * Extract metadata about the commit from the UI.
			 */
			let commitId, commitMessage, dateIso;
			[commitId, commitMessage, dateIso] = onVersion(
				() => {
					const commitAnchor = document.querySelector('.commit-badge-oneline .commit-details .commitid');
					const commitTimeTag = document.querySelector('.commit-badge-oneline .commit-details time');
					const commitMessage = commitAnchor.getAttribute('data-commit-message');
					const dateIso = commitTimeTag.getAttribute('datetime').slice(0, 'YYYY-MM-DD'.length);
					const commitId = commitAnchor.getAttribute('data-commitid');
					return [commitId, commitMessage, dateIso];
				},
				() => {
					const commitIdTag = document.querySelector('.css-tbegx5.e1tw8lnx2 strong+strong');
					let dateStr;
					try {
						const commitTimeTag = document.querySelector('.css-tbegx5.e1tw8lnx2 time');
						dateStr = commitTimeTag.getAttribute('datetime').slice(0, 'YYYY-MM-DD'.length);
					} catch (e) {
						/*
						 * When a commit is recent, Bitbucket Cloud shows a human-readable string
						 * such as "4 days ago" or "19 minutes ago". This string is localized,
						 * and the `title` attribute of the corresponding HTML tag is also localized.
						 * There is no ISO 8601 timestamp easily available.
						 */
						warn("No time tag :-(", e);
						dateStr = null;
					}

					const commitMsgContainer = document.querySelector('.css-1qa9ryl.e1tw8lnx1+div');
					return [
						commitIdTag.innerText,
						commitMsgContainer.innerText,
						dateStr /* can't extract ISO date in Bitbucket Cloud from UI in _all_ cases */
					];
				}
			);
			/*
			 * Load pre-rendered HTML.
			 */
			let htmlSubject;
			await onVersion(
				() => {
					/* Bitbucket Server doesn't need additional requests.
					 * Just initialize `htmlSubject` to an empty string for
					 * function `htmlSyntaxLink` down the line. */
					htmlSubject = "";
				},
				async () => {
					try {
						// TODO better way of getting projectKey and repositorySlug
						const mainSelfLink = document.querySelector('#bitbucket-navigation a');
						// slice(1, -1) is needed to cut off slashes
						const projectKeyRepoSlug = mainSelfLink.getAttribute('href').slice(1, -1);
						const commitRestUrl = `/!api/2.0/repositories/${projectKeyRepoSlug}/commit/${commitId}?fields=%2B%2A.rendered.%2A`;
						log(`Fetching "${commitRestUrl}"...`);
						const commitResponse = await fetch(commitRestUrl);
						const commitJson = await commitResponse.json();
						/*
						 * If loaded successfully, extract particular parts of
						 * the JSON that we are interested in.
						 */
						dateIso = commitJson.date.slice(0, 'YYYY-MM-DD'.length);
						htmlSubject = firstHtmlParagraph(commitJson.summary.html);
					} catch (e) {
						error("Cannot fetch commit JSON from REST API", e);
					}
				}
			);

			const subject = commitMessageToSubject(commitMessage);

			const plainText = plainTextCommitReference(commitId, subject, dateIso);
			const html = await htmlSyntaxLink(commitId, subject, dateIso, htmlSubject);
			log("plain text:", plainText);
			log("HTML:", html);

			const handleCopyEvent = e => {
				addLinkToClipboard(e, plainText, html);
			};
			document.addEventListener('copy', handleCopyEvent);
			document.execCommand('copy');
			document.removeEventListener('copy', handleCopyEvent);
		} catch (e) {
			error('Could not do the copying', e);
		}
	}

	// from https://stackoverflow.com/a/61511955/1083697 by Yong Wang
	function waitForElement(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}
			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	// adapted from https://stackoverflow.com/a/35385518/1083697 by Mark Amery
	function htmlToElement(html) {
		const template = document.createElement('template');
		template.innerHTML = html.trim();
		return template.content.firstChild;
	}

	function copyLink() {
		const onclick = (event) => copyClickAction(event);

		const linkText = "Copy commit reference";
		const style = 'margin-left: 1em;';
		const anchor = htmlToElement(`<a href="#" style="${style}">${linkText}</a>`);
		anchor.onclick = onclick;
		return anchor;
	}

	function doAddLink() {
		onVersion(
			() => waitForElement('.commit-details'),
			() => waitForElement('.css-tbegx5.e1tw8lnx2')
		).then(target => {
			debug('target', target);
			const container = htmlToElement(`<span id="${CONTAINER_ID}"></span>`);
			target.append(container);
			const link = copyLink();
			container.append(' ');
			container.appendChild(link);
		});
	}

	function removeExistingContainer() {
		const container = document.getElementById(CONTAINER_ID);
		if (!container) {
			return;
		}
		container.parentNode.removeChild(container);
	}

	function ensureLink() {
		try {
			/*
			 * Need this attribute to detect the kind of Bitbucket: Server or Cloud.
			 */
			waitForElement('[data-aui-version]')
				.then(loadedBody => doAddLink());
		} catch (e) {
			error('Could not create the button', e);
		}
	}

	ensureLink();

	/*
	 * Clicking on a commit link on Bitbucket Cloud doesn't trigger a page load
	 * (sometimes, at least).  To cover such cases, we need to automatically
	 * detect that the commit in the URL has changed.
	 *
	 * For whatever reason listener for popstate events doesn't work to
	 * detect a change in the URL.
	 * https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
	 *
	 * As a workaround, observe the changes in the <title> tag, since commits
	 * will have different <title>s.
	 */
	let currentUrl = document.location.href;
	const observer = new MutationObserver((mutationsList) => {
		const maybeNewUrl = document.location.href;
		log('Mutation to', maybeNewUrl);
		if (maybeNewUrl != currentUrl) {
			currentUrl = maybeNewUrl;
			log('MutationObserver: URL has changed:', currentUrl);
			ensureLink();
		}
	});
	observer.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });
	log('Added MutationObserver');
})();
