// ==UserScript==
// @name         Bitbucket : commit links in PRs
// @namespace    http://tampermonkey.net/
// @version      4
// @license      MIT
// @description  Adds convenience links in PRs of Bitbucket v7.6.8
// @author       Andrei Rybak
// @match        https://bitbucket.example.com/projects/*/repos/*/pull-requests/*
// @icon         https://bitbucket.org/favicon.ico
// @updateURL    https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2021 Andrei Rybak
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
	const parsePath = /[/]projects[/]([^/]*)[/]repos[/]([^/]*)[/].*[/]commits[/]([0-9a-f]+)/

	function ensureCommitLink() {
		const matching = document.location.pathname.match(parsePath);
		if (!matching) {
			log("No commit in the URL: " + document.location.pathname);
			return;
		}
		const origin = document.location.origin;
		const hash = document.location.hash; // add hash in case the user clicked to a different file
		const project = matching[1];
		const repository = matching[2];
		const commit = matching[3];
		log("Parsed " + project + "/" + repository + "/" + commit);

		const url = origin + '/projects/' + project + '/repos/' + repository + '/commits/' + commit + document.location.hash;
		const linkText = commit.substring(0, ABBREV_LEN);
		const titleText = $($('.selected-value-help-info')[0]).text();
		log("Link:  " + url);
		log("Text:  " + linkText);
		log("Title: " + titleText);

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
			.text(linkText)
			.prop('title', titleText);
		log("Done");
	}

	$(document).ready(function() {
		ensureCommitLink();
		window.onpopstate = function(event) {
			ensureCommitLink();
		};
	});

})();
