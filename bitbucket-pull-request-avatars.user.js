// ==UserScript==
// @name         Bitbucket: PR author avatar as favicon
// @namespace    http://tampermonkey.net/
// @version      1
// @license      MIT
// @description  Set Bitbucket PR favicon to author's avatar
// @author       Andrei Rybak
// @include      https://*bitbucket*/*/repos/*/pull-requests/*
// @match        https://bitbucket.example.com/*/repos/*/pull-requests/*
// @icon         https://bitbucket.org/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
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

(function() {
	'use strict';

	function log(...toLog) {
		console.log("[PR avatars]", ...toLog);
	}

	window.addEventListener('load', function() {
		let userAvatar = document.querySelector("[data-testid=pull-request-author--image]");
		let shortcutIcon = document.querySelector('link[rel="shortcut icon"]');
		if (userAvatar && shortcutIcon) {
			let image = userAvatar.style.backgroundImage;
			let url = image.substr(5, image.length - 7); // cut out the URL from CSS code `url('...');`
			log("URL = " + url);
			shortcutIcon.href = url;
		}
	}, false);
})();
