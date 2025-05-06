// ==UserScript==
// @name         Confluence: copy link buttons
// @namespace    https://github.com/rybak
// @version      5
// @description  Adds buttons to copy a link to the current page directly into clipboard. Two buttons are supported: Markdown and Jira syntax. Both buttons support HTML for rich text editors.
// @author       Andrei Rybak
// @license      MIT
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @include      https://confluence*
// @match        https://confluence.example.com/*
// @icon         https://seeklogo.com/images/C/confluence-logo-D9B07137C2-seeklogo.com.png
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2023-2024 Andrei Rybak
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

(function() {
	'use strict';

	const LOG_PREFIX = '[Confluence copy link buttons]:';

	function log(...toLog) {
		console.log(LOG_PREFIX, ...toLog);
	}

	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	function cloudCopyIcon() {
		// icon similar to the achnor "Copy link" under the button "Share"
		return '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M12.654 8.764a.858.858 0 01-1.213-1.213l1.214-1.214a3.717 3.717 0 015.257 0 3.714 3.714 0 01.001 5.258l-1.214 1.214-.804.804a3.72 3.72 0 01-5.263.005.858.858 0 011.214-1.214c.781.782 2.05.78 2.836-.005l.804-.803 1.214-1.214a1.998 1.998 0 00-.001-2.831 2 2 0 00-2.83 0l-1.215 1.213zm-.808 6.472a.858.858 0 011.213 1.213l-1.214 1.214a3.717 3.717 0 01-5.257 0 3.714 3.714 0 01-.001-5.258l1.214-1.214.804-.804a3.72 3.72 0 015.263-.005.858.858 0 01-1.214 1.214 2.005 2.005 0 00-2.836.005l-.804.803L7.8 13.618a1.998 1.998 0 00.001 2.831 2 2 0 002.83 0l1.215-1.213z" fill="currentColor"></path></svg>';
	}

	/*
	 * Calls one of the parameters, based on the version of Confluence running.
	 * This is needed to account for the differences in HTML and CSS.
	 *
	 * Tested on versions:
	 * - Confluence Server 7.13.*
	 * - Confluence Server 7.19.*
	 * - Confluence Cloud 1000.0.0-22300355ddad (a free version on https://atlassian.net as of 2023-06-19)
	 */
	function onVersion(selfHostedFn, cloudFn) {
		if (document.querySelector('meta[name=ajs-cloud-id]')) {
			// It would seem that all Cloud instances of Confluece have this <meta> tag.
			return cloudFn();
		}
		/*
		 * Try to parse version number hidden in the <meta> tags.
		 * Assume Confluence Cloud, if can't parse.
		 */
		const maybeVersionElem = document.querySelector('meta[name=ajs-version-number]');
		if (maybeVersionElem) {
			const majorVersion = parseInt(maybeVersionElem.content);
			if (isNaN(majorVersion)) {
				log("Cannot parse major version", maybeVersionElem.content);
				return cloudFn();
			}
			if (majorVersion >= 1000) {
				return cloudFn();
			} else {
				return selfHostedFn();
			}
		} else {
			log("Couldn't find meta tag with version");
			return cloudFn();
		}
	}

	function addLinkToClipboard(event, plainText, html) {
		event.stopPropagation();
		event.preventDefault();

		let clipboardData = event.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', plainText);
		clipboardData.setData('text/html', html);
	}

	function copyClickAction(event, plainTextFn) {
		event.preventDefault();
		try {
			let pageTitle = null;
			try {
				pageTitle = document.querySelector('meta[name="ajs-page-title"]').content;
			} catch (ignored) {
			}
			if (!pageTitle) {
				try {
					// `AJS` is defined in Confluence's own JS
					pageTitle = AJS.Data.get('page-title');
				} catch (e) {
					error('Could not get the page title. Aborting.', e);
					return;
				}
			}
			const url = document.querySelector('link[rel="shortlink"]').href;
			/*
			 * Using both plain text and HTML ("rich text") means that the copied links
			 * can be inserted both in plain text inputs (Jira syntax – for Jira, Markdown
			 * syntax – for Bitbucket, GitHub, etc) and in rich text inputs, such as
			 * Microsoft Word, Slack, etc.
			 */
			const plainText = plainTextFn(url, pageTitle);
			const html = htmlSyntaxLink(url, pageTitle);

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

	// adapted from https://stackoverflow.com/a/35385518/1083697 by Mark Amery
	function htmlToElement(html) {
		const template = document.createElement('template');
		template.innerHTML = html.trim();
		return template.content.firstChild;
	}

	function selfHostedButtonHtml(text, title) {
		const icon = '<span class="aui-icon aui-icon-small aui-iconfont-copy"></span>';
		return `<a href="#" class="aui-button aui-button-subtle" title="${title}"><span>${icon}${text}</span></a>`;
	}

	function cloudButtonHtml(text, title) {
		const icon = cloudCopyIcon();
		// Custom CSS is needed to make the ${text} readable.
		const customCss = 'font-size: 16px; line-height: 26px;';
		// HTML & CSS classes from the "Watch this page" button
		const watchThisPageButton = document.querySelector('[data-id="page-watch-button"]');
		const buttonClasses = watchThisPageButton.className;
		const innerSpanClasses = watchThisPageButton.children[0].className;
		const innerInnerSpanClasses = watchThisPageButton.children[0].children[0].className;
		return htmlToElement(
			`<button class="${buttonClasses}" type="button">
			  <span class="${innerSpanClasses}" title="${title}">
			    <span class="${innerInnerSpanClasses}" role="img" style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF); ${customCss}">
			      ${icon}${text}
			    </span>
			  </span>
			</button>`
		);
	}

	function copyButton(text, title, plainTextFn) {
		const onclick = (event) => copyClickAction(event, plainTextFn);

		return onVersion(
			() => {
				const copyButtonAnchor = htmlToElement(selfHostedButtonHtml(text, title));
				copyButtonAnchor.onclick = onclick;
				const copyButtonListItem = htmlToElement('<li class="ajs-button normal"></li>');
				copyButtonListItem.appendChild(copyButtonAnchor);
				return copyButtonListItem;
			},
			() => {
				const button = cloudButtonHtml(text, title);
				button.onclick = onclick;
				return button;
			}
		);
	}

	function htmlSyntaxLink(url, pageTitle) {
		const html = `<a href="${url}">${pageTitle}</a>`;
		return html;
	}

	function markdownSyntaxLink(url, pageTitle) {
		return `[${pageTitle}](${url})`;
	}

	function jiraSyntaxLink(url, pageTitle) {
		return `[${pageTitle}|${url}]`;
	}

	function insertBefore(newElem, oldElem) {
		oldElem.parentNode.insertBefore(newElem, oldElem);
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

	function createButtons() {
		onVersion(
			() => waitForElement('#action-menu-link'),
			() => waitForElement('button[aria-label="Share"]').then(shareButton => {
				// HTML of Cloud version is weird, lots of nesting and wrapping
				return shareButton.parentNode.parentNode.parentNode.parentNode;
			})
		).then(target => {
			/*
			 * Buttons are added to the left of the `target` element.
			 */
			log('target', target);
			const markdownListItem = copyButton("[]()", "Copy Markdown link", markdownSyntaxLink);
			const jiraListItem = copyButton("[&#124;]", "Copy Jira syntax link", jiraSyntaxLink);
			insertBefore(markdownListItem, target);
			insertBefore(jiraListItem, target);
			log('Created buttons');
		});
	}

	try {
		createButtons();
	} catch (e) {
		error('Could not create buttons', e);
	}
})();
