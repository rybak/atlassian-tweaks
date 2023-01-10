// ==UserScript==
// @name         Jira: Pull Request Link Improver
// @namespace    http://tampermonkey.net/
// @version      8
// @license      MIT
// @description  Adds more convenient pull request links to Jira tickets.
// @author       Andrei Rybak
// @match        https://jira.example.com/browse/*
// @include      https://*jira*/browse/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2022-2023 Andrei Rybak
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

	const PANEL_ID = 'PrLinksImproverPanel';
	const LIST_ID = 'PrLinksImproverList';
	var loadInProgress = false;

	function log(...toLog) {
		console.log('[PR Link Improver]:', ...toLog);
	}

	function warn(...toLog) {
		console.warn('[PR Link Improver]:', ...toLog);
	}

	function getJiraMajorVersion() {
		return document.querySelector('meta[name="application-name"]').attributes.getNamedItem("data-version").value.split(".")[0];
	}

	function createPanel() {
		var header;
		const jiraMajorVersion = getJiraMajorVersion();
		switch (jiraMajorVersion) {
			case "7":
				header = '<div class="mod-header"><h2 class="toggle-title">Pull requests</h2></div>';
				break;
			case "8":
				header = '<div class="mod-header"><h4 class="toggle-title">Pull requests</h4></div>';
				break;
			default:
				warn("Jira v" + jiraMajorVersion + " is not supported");
				header = '<div class="mod-header"><h4 class="toggle-title">Pull requests</h4></div>';
				return;
		}
		$('#viewissue-devstatus-panel')
			.prepend($(header +
				`<div class="mod-content" id="${PANEL_ID}" style="margin-bottom:1rem;"></div>`));
	}

	function addError(errors) {
		for (const e of errors) {
			log("Error: " + e);
		}
		$(`#${PANEL_ID}`).append($(`<p>Could not load from Bitbucket. Got: ${errors}</p>`));
	}

	function addPrLinks(pullRequests) {
		$(`#${PANEL_ID}`).append($(`<ul id="${LIST_ID}" class="item-details status-panels devstatus-entry"></ul>`));
		const list = $(`#${LIST_ID}`);
		for (const pr of pullRequests) {
			const url = pr.url;
			const prId = pr.id;
			const li = $('<li/>').appendTo(list);
			var link = `<a href="${url}">${prId}: ${pr.name}</a>`;
			log("NAME='" + pr.name + "' issue='" + JIRA.Issue.getIssueKey() + "'");
			if (pr.name.includes(JIRA.Issue.getIssueKey())) {
				link = `<strong>${link}</strong>`;
			}
			if (pr.status == "DECLINED") {
				link = `<s>${link}</s>`;
			}
			$(link).appendTo(li);
		}
	}

	function addPrLinksPanel() {
		if ($(`#${PANEL_ID}`).length) {
			// the PR links panel has already been created
			loadInProgress = false;
			return;
		}
		const issueId = JIRA.Issue.getIssueId();
		// https://community.atlassian.com/t5/Jira-questions/JIRA-REST-API-to-get-list-of-branches-related-to-a-issue/qaq-p/800389
		const pullRequestsUrl = `/rest/dev-status/1.0/issue/detail?issueId=${issueId}&applicationType=stash&dataType=pullrequest`;
		log("Loading: " + pullRequestsUrl);
		$.getJSON(pullRequestsUrl, data => {
			if ($(`#${PANEL_ID}`).length) {
				// the PR links panel has been created while we were getting the PR data
				loadInProgress = false;
				return;
			}
			createPanel();
			if (data.detail.length == 0) {
				addError(data.errors);
				loadInProgress = false;
				return;
			}
			const pullRequests = data.detail[0].pullRequests;
			addPrLinks(pullRequests);
			loadInProgress = false;
		});
	}

	function startPrLoading() {
		if (!loadInProgress) {
			loadInProgress = true;
			addPrLinksPanel();
		} else {
			log("Already loading. Skipping...");
		}
	}

	$(document).ready(startPrLoading);
	JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, startPrLoading);
})();
