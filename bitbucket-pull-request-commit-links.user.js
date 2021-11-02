// ==UserScript==
// @name         Bitbucket : commit links in PRs
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Adds convenience links in PRs of Bitbucket v7.6.8
// @author       Andrei Rybak
// @match        https://bitbucket.example.com/projects/*/repos/*/pull-requests/*
// @icon         https://bitbucket.org/favicon.ico
// @updateURL    https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

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
		log("Link: " + url);

		const prevBlock = $('#' + BLOCK_ID);
		if (prevBlock.length) {
			$('#' + URL_ID)
				.attr('href', url)
				.text(linkText);
			log("Updated link");
		} else {
			const link = '<a id="' + URL_ID + '" href="' + url + '">' + linkText + "</a>";
			const html = '<div id="' + BLOCK_ID + '"><div class="css-18u3ks8">' + link + '</div></div>';
			$(".changes-scope-actions").append(html);
			log("Created link");
		}
	}

	$(document).ready(function() {
		ensureCommitLink();
		window.onpopstate = function(event) {
			ensureCommitLink();
		};
	});

})();
