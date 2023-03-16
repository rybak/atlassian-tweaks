// ==UserScript==
// @name         Confluence: space avatar as tab icon
// @namespace    http://tampermonkey.net/
// @description  Sets browser tab icon of Confluence to the avatar of the space.
// @author       Andrei Rybak
// @include      https://*confluence*/*/repos/*/pull-requests/*
// @match        https://confluence.example.com/*/repos/*/pull-requests/*
// @icon         https://wac-cdn-2.atlassian.com/image/upload/f_auto,q_auto/dam/jcr:5d1374c2-276f-4bca-9ce4-813aba614b7a/confluence-icon-gradient-blue.svg?cdnVersion=691
// @version      1
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	function log(...toLog) {
		console.log("[avatar favicons]", ...toLog);
	}

	function changeFavicon() {
		log("Trying...");
		const avatar = document.querySelector(".avatar-img");
		const shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
		const icon = document.querySelector('link[rel="icon"]');
		if (avatar && (shortcutIcon || icon)) {
			const url = avatar.src;
			log("URL = " + url);
			if (shortcutIcon) {
				shortcutIcon.href = url;
				log("Done shortcut.");
			}
			if (icon) {
				icon.href = url;
				log("Done icon.");
			}
		} else {
			log("Something went wrong.", avatar, shortcutIcon, icon);
		}
	}

	window.addEventListener('load', function() {
		changeFavicon();
	}, false);
})();
