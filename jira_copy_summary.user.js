// ==UserScript==
// @name         JIRA copy summary
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  copies summary of JIRA ticket
// @author       Sergey Lukashevich, Andrei Rybak, Dmitry Trubin
// @homepage     https://github.com/rybak/atlassian-tweaks
// @match        https://jira.example.com/browse/*
// @match        https://jira.example.com/browse/*
// @grant        none
// ==/UserScript==

/*
 * Copyright 2017-2021 Sergey Lukashevich
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
	'use strict';

	/*
	 * User configuration
	 */
	const ITALICS = true;

	// https://stackoverflow.com/a/39914235/1083697
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function getMeta(metaName) {
		const metas = document.getElementsByTagName('meta');

		for (let i = 0; i < metas.length; i++) {
			if (metas[i].getAttribute('name') === metaName) {
				return metas[i].getAttribute('content');
			}
		}

		return '';
	}

	var textResult = '';
	var htmlResult = '';

	function handleCopyEvent(e) {
		var clipboardData;

		// Stop event propogation
		e.stopPropagation();
		e.preventDefault();

		clipboardData = e.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', textResult);
		clipboardData.setData('text/html', htmlResult);
	}

	var COPY_BUTTON_ID = "copycopy";
	var copyButton;

	function getJiraMajorVersion() {
		return document.querySelector('meta[name="application-name"]').attributes.getNamedItem("data-version").value.split(".")[0];
	}

	function createButtonForJira7() {
		var ul = document.createElement("ul");
		ul.classList.add("toolbar-group");
		ul.classList.add("pluggable-ops");

		var li = document.createElement("li");
		li.classList.add("toolbar-item");

		copyButton = document.createElement("a");
		copyButton.id = COPY_BUTTON_ID;
		copyButton.classList.add("toolbar-trigger");
		copyButton.classList.add("zeroclipboard-is-hover");
		copyButton.textContent = "Copy summary*";

		ul.appendChild(li);
		li.appendChild(copyButton);

		return ul;
	}

	function createButtonForJira8() {
		var div = document.createElement("div");
		div.id = "opsbar-copycopy_container"
		div.classList.add("aui-buttons");
		div.classList.add("pluggable-ops");

		copyButton = document.createElement("a");
		copyButton.id = COPY_BUTTON_ID;
		copyButton.classList.add("aui-button");
		copyButton.classList.add("toolbar-trigger");
		copyButton.classList.add("zeroclipboard-is-hover");
		copyButton.textContent = "Copy summary*";

		div.appendChild(copyButton);

		return div;
	}

	function copyClickAction() {
		var summaryText = document.getElementById("summary-val").textContent;
		var ticketIdSource = document.querySelector("#dx-issuekey-val-h1 a");
		if (!ticketIdSource) {
			ticketIdSource = document.querySelector(".aui-page-header-main .issue-link");
		}
		var ticketId = ticketIdSource.dataset.issueKey;
		var jiraUrl = getMeta("ajs-jira-base-url");
		var fullLink = jiraUrl + "/browse/" + ticketId;
		textResult = '[' + ticketId + '] ' + summaryText;
		if (ITALICS) {
			summaryText = '<i>' + summaryText + '</i>';
		}
		htmlResult = '[<a href="' + fullLink + '">' + ticketId + '</a>] ' + summaryText;
		document.addEventListener('copy', handleCopyEvent);
		document.execCommand('copy');
		document.removeEventListener('copy', handleCopyEvent);
		return false;
	};

	function createButton() {
		try {
			copyButton = document.getElementById(COPY_BUTTON_ID);
			// if for some reason it doesn't exist - create one
			if (!copyButton) {
				const jiraMajorVersion = getJiraMajorVersion();
				var container;
				var button;
				switch (jiraMajorVersion) {
					case "7":
						container = document.getElementById("stalker").getElementsByClassName("toolbar-split toolbar-split-left")[0];
						button = createButtonForJira7();
						break;
					case "8":
						container = document.getElementById("stalker").getElementsByClassName("aui-toolbar2-primary")[0];
						button = createButtonForJira8();
						break;
					default:
						console.log("JIRA v" + jiraMajorVersion + " is not supported");
						return;
				}
				container.appendChild(button);
				console.log("Created the button");
			} else {
				console.log("Using existing button");
			}
			copyButton.onclick = copyClickAction;
		} catch (e) {
			console.warn("Could not create 'Copy summary' button ", e);
		}
	}

	createButton();

	async function keepButtonAlive() {
		while (true) {
			var copyButton = document.getElementById(COPY_BUTTON_ID);
			if (!copyButton || !copyButton.onclick) {
				console.log("Copy summary button died, recreating...");
				createButton();
			}
			await sleep(1000);
		}
	};

	keepButtonAlive();
})();
