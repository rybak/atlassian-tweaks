// ==UserScript==
// @name         Bitbucket : commit links in PRs
// @namespace    http://tampermonkey.net/
// @version      9
// @license      MIT
// @description  Adds convenience links in PRs of Bitbucket v7.6.+
// @author       Andrei Rybak
// @match        https://bitbucket.example.com/projects/*/repos/*/pull-requests/*
// @icon         https://bitbucket.org/favicon.ico
// @updateURL    https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2021-2022 Andrei Rybak
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

	function log(msg) {
		console.log("[PR commit links] " + msg);
	}

	const ABBREV_LEN = 8; // abbreviate commit hashes to this number of characters
	const BLOCK_ID = 'RybakCommitLinkDiv';
	const URL_ID = 'RybakCommitLinkA';
	const TOOLTIP_BLOCK_ID = 'RybakCommitMessageDiv';
	const TOOLTIP_MSG_ID = 'RybakCommitMessagePre';
	const parsePath = /[/](projects|users)[/]([^/]*)[/]repos[/]([^/]*)[/].*[/]commits[/]([0-9a-f]+)/

	function createTooltip(message) {
		$('#' + BLOCK_ID).hover((e) => {
			$('#' + TOOLTIP_BLOCK_ID).remove(); // delete previous tooltip
			const tooltipHtml = $('<div id="' + TOOLTIP_BLOCK_ID + '" class="Tooltip sc-jnlKLf ghcsui sc-bZQynM WXFrO sc-EHOje cffcMV"' +
				'style="z-index:800; opacity: 1; position: fixed; top: 0px; left: 0px;' + // tweaked original element.style
				'max-width: 600px; width: auto;' + // override of .ghcsui for better fitting of text
				'background-color: rgb(23, 43, 77); border-radius: 3px; box-sizing: border-box; color: rgb(255, 255, 255); font-size: 12px; ' + // from .WXFrO
				'line-height: 1.3; padding: 2px 6px; overflow-wrap: break-word;' + // from .WXFrO
				'pointer-events: none;' + // from .cffcMV
				'">' +
				'<pre id="' + TOOLTIP_MSG_ID + '" class="commit-message-tooltip" style="' +
				'white-space: pre-wrap; word-break: break-word;' + // from .commit-message-tooltip
				'"></pre>' +
				'</div>');
			$($('.atlaskit-portal-container')[0]).append(tooltipHtml);
			$('#' + TOOLTIP_MSG_ID).text(message); // text added early to calculate height correctly

			const width = $('#' + TOOLTIP_BLOCK_ID).outerWidth();
			const height = $('#' + TOOLTIP_BLOCK_ID).height();
			const block = $('#' + BLOCK_ID);
			const blockOffset = block.offset();
			var x = blockOffset.left;
			var y = blockOffset.top + block.height() + 8; // 8 is from CSS rule ".changes-scope-actions > *"
			const maxX = $(window).width() + window.pageXOffset;
			const maxY = $(window).height() + window.pageYOffset;
			if (x + width > maxX) {
				x = Math.max(maxX - width, 0);
			}
			if (y + height > maxY) {
				y = Math.max(maxY - height, 0);
			}
			$('#' + TOOLTIP_BLOCK_ID).css({left: x, top: y}).show();
		}, (e) => {
			$('#' + TOOLTIP_BLOCK_ID).hide();
		});
	}

	function ensureCommitLink() {
		const matching = document.location.pathname.match(parsePath);
		if (!matching) {
			log("No commit in the URL: " + document.location.pathname);
			return;
		}
		const origin = document.location.origin;
		const hash = document.location.hash; // add hash in case the user clicked to a different file
		const projectOrUser = matching[1];
		const project = matching[2];
		const repository = matching[3];
		const commit = matching[4];
		log("Parsed " + project + "/" + repository + "/" + commit);

		const url = origin + '/projects/' + project + '/repos/' + repository + '/commits/' + commit + document.location.hash;
		const linkText = commit.substring(0, ABBREV_LEN);
		log("Link:  " + url);
		log("Text:  " + linkText);

		const prevBlock = $('#' + BLOCK_ID);
		if (prevBlock.length) {
			log("Updating the link...");
		} else {
			const html = '<div id="' + BLOCK_ID + '"><div class="css-18u3ks8">' + '<a id="' + URL_ID + '"></a>' + '</div></div>';
			$(".changes-scope-actions").append(html);
			log("Creating the link...");
		}
		$('#' + URL_ID)
			.attr('href', url)
			.text(linkText);
		log("Ajax...: " + document.location.origin + "/rest/api/1.0/projects/" + project + '/repos/' + repository + '/commits/' + commit);

		$.ajax({
			// https://docs.atlassian.com/bitbucket-server/rest/7.6.0/bitbucket-rest.html#idp224
			url: (document.location.origin + "/rest/api/1.0/" + projectOrUser + "/" + project + '/repos/' + repository + '/commits/' + commit)
		}).then(data => {
			log("Ajax response received");
			createTooltip(data.message);
		});
		log("Done");
	}

	$(document).ready(function() {
		ensureCommitLink();
		window.onpopstate = function(event) {
			ensureCommitLink();
		};
	});

})();
