// ==UserScript==
// @name         Jira: Project icon as tab icon
// @namespace    https://github.com/rybak/atlassian-tweaks
// @version      7-alpha
// @license      MIT
// @description  Changes browser tab icon to Jira project icon
// @author       Sergey Lukashevich
// @include      https://*jira*/*
// @match        https://jira.example.com/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2022-2023 Sergey Lukashevich
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

	const LOG_PREFIX = "[Jira project favicon]";

	function error(...toLog) {
		console.error(LOG_PREFIX, ...toLog);
	}

	function log(...toLog) {
		console.log(LOG_PREFIX, ...toLog);
	}

	function debug(...toLog) {
		console.debug(LOG_PREFIX, ...toLog);
	}

	function setFavicon(avatarUrl) {
		const faviconNodes = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
		if (!faviconNodes || faviconNodes.length == 0) {
			error("Cannot find favicon elements.");
			return;
		}
		log("New URL", avatarUrl);
		faviconNodes.forEach(node => {
			log("Replacing old URL =", node.href);
			node.href = avatarUrl;
		});
	}

	function getProjectKeyFromCurrentUrl() {
		const pathname = document.location.pathname;
		if (pathname.startsWith("/browse/")) {
			const projectKey = pathname.slice(8, pathname.indexOf('-'));
			log(`Found projectKey="${projectKey}" in a ticket URL.`);
			return projectKey;
		}
		// first /browse/ link on the page is often to the project
		const maybeProjectLink = document.querySelector('[href^="/browse/"]');
		if (maybeProjectLink) {
			const projectKey = maybeProjectLink.getAttribute('href').slice(8);
			log(`Found projectKey="${projectKey}" in a random link.`);
			return projectKey;
		}
		return null;
	}

	async function changeFavicon() {
		let projectAvatar = document.getElementById('project-avatar');
		let avatarUrl = null;
		if (!projectAvatar) {
			let elements = document.getElementsByClassName('aui-avatar-project');
			if (elements.length === 1) {
				let byTagName = elements[0].getElementsByTagName('img');
				if (byTagName.length === 1) {
					projectAvatar = byTagName[0];
				}
			}
		}

		if (projectAvatar) {
			// Jira Server (self-hosted)
			avatarUrl = projectAvatar.src;
		} else {
			// try layout as in the cloud version of Jira Software
			projectAvatar = document.querySelector('div[data-navheader="true"] span[style*=background]');
			if (projectAvatar) {
				const bgImage = projectAvatar.style.getPropertyValue("background-image");
				avatarUrl = bgImage.slice(5, bgImage.length - 7); // cut out the URL from CSS code `url('...');`
			} else {
				projectAvatar = document.querySelector('nav[aria-label="Breadcrumbs"] img');
				if (projectAvatar) {
					avatarUrl = projectAvatar.src;
				} else {
					/*
					 * Last ditch effort: try loading from REST API.
					 * Documentation:
					 *   Cloud:  https://docs.atlassian.com/software/jira/docs/api/REST/1000.824.0/#api/2/project-getProject
					 *   Server: TBD
					 * Note that request `GET /rest/api/2/project/{projectIdOrKey}/avatars` is for
					 * avatars "visible for the currently logged in user", not exactly for the
					 * project of `{projectIdOrKey}`.
					 */
					// TODO: figure out how to get projectKey from _any_ page
					let projectKey = getProjectKeyFromCurrentUrl();
					const projectRestApiUrl = `/rest/api/2/project/${projectKey}`;
					try {
						log(`Fetching "${projectRestApiUrl}"...`);
						const response = await fetch(projectRestApiUrl);
						const json = await response.json();
						log("Got avatars from JSON", json.avatarUrls);
						avatarUrl = json.avatarUrls['48x48'];
					} catch (e) {
						error(`Cannot fetch "${projectRestApiUrl}"`, e);
					}
				}
			}
		}

		if (!avatarUrl) {
			error("Cannot find the avatar URL");
			return;
		}
		setFavicon(avatarUrl);
	}

	changeFavicon();
})();
