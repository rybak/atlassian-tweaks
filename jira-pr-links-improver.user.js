// ==UserScript==
// @name         JIRA: Pull Request Link Improver
// @namespace    http://tampermonkey.net/
// @version      2
// @license      MIT
// @description  Adds more convenient pull request links to JIRA tickets.
// @author       Andrei Rybak
// @match        https://jira.example.com/browse/*
// @match        https://jira.example.com/browse/*
// @icon         https://jira.atlassian.com/favicon.ico
// @updateURL    https://github.com/rybak/atlassian-tweaks/raw/main/jira-pr-links-improver.user.js
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2022 Andrei Rybak
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

	function log(...toLog) {
		console.log('[PR Link Improver]:', ...toLog);
	}

	function createPanel() {
		$('#viewissue-devstatus-panel')
			.prepend($('<div class="mod-header"><h2 class="toggle-title">Pull requests</h2></div>' +
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
			$(`<a href="${url}"><strong>${prId}</strong>: ${pr.name}</a>`)
				.appendTo(li);
		}
	}

	$(document).ready(() => {
		const issueId = JIRA.Issue.getIssueId();
		// https://community.atlassian.com/t5/Jira-questions/JIRA-REST-API-to-get-list-of-branches-related-to-a-issue/qaq-p/800389
		const pullRequestsUrl = `/rest/dev-status/1.0/issue/detail?issueId=${issueId}&applicationType=stash&dataType=pullrequest`;
		$.getJSON(pullRequestsUrl, data => {
			createPanel();
			if (data.detail.length == 0) {
				addError(data.errors);
				return;
			}
			const pullRequests = data.detail[0].pullRequests;
			addPrLinks(pullRequests);
		});
	});
})();
