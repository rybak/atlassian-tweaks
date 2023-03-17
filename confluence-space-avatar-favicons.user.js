// ==UserScript==
// @name         Confluence: space avatar as tab icon
// @namespace    https://github.com/rybak
// @description  Sets browser tab icon of Confluence to the avatar of the space.
// @author       Andrei Rybak
// @include      https://*confluence*/*
// @match        https://confluence.example.com/*
// @icon         https://wac-cdn-2.atlassian.com/image/upload/f_auto,q_auto/dam/jcr:5d1374c2-276f-4bca-9ce4-813aba614b7a/confluence-icon-gradient-blue.svg?cdnVersion=691
// @version      2
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
		const avatar = document.querySelector(".avatar-img") || document.querySelector('img[data-testid="space-icon"]');
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
