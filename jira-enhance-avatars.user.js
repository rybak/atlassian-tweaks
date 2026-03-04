// ==UserScript==
// @name         Jira: enhance avatars
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      1
// @license      MIT
// @description  Enhances resolution of project avatars on Jira.
// @author       Andrei Rybak
// @match        https://jira.example.com/browse/*
// @include      https://*jira*/browse/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @require      https://cdn.jsdelivr.net/gh/rybak/userscript-libs@e86c722f2c9cc2a96298c8511028f15c45180185/waitForElement.js
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2026 Andrei Rybak
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

/* jshint esversion: 6 */
/* globals waitForElement AJS */

(function() {
	'use strict';

	const PROJECT_AVATAR_SIZE = 256;

	function improveImg(img) {
		img.src = img.src + '&size=' + PROJECT_AVATAR_SIZE;
	}

	function enhanceAvatars() {
		document.querySelectorAll('img[src*="/secure/projectavatar"]')
			.forEach(improveImg);
	}

	waitForElement('#project-avatar').then(ignored => {
		waitForElement('#sidebar .aui-avatar-inner').then(ignored2 => {
			enhanceAvatars();
		})
	});
})();
