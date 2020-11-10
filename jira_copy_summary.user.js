// ==UserScript==
// @name         JIRA copy summary
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  copies summary of JIRA ticket
// @author       Sergey Lukashevich, Andrei Rybak
// @homepage     https://github.com/rybak/atlassian-tweaks
// @match        https://jira.example.com/browse/*
// @grant        none
// ==/UserScript==

/*
 * Copyright 2017-2020 Sergey Lukashevich
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

(function() {
	'use strict';

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

	function handleCopyEvent (e) {
		var clipboardData;

		// Stop event propogation
		e.stopPropagation();
		e.preventDefault();

		clipboardData = e.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', textResult);
		clipboardData.setData('text/html', htmlResult);
	}

	var copyButton = document.getElementById("copycopy");
	// if by some reason it doesn't exist - create one
	if (!copyButton) {
		var container = document.getElementById("stalker").getElementsByClassName("toolbar-split toolbar-split-left")[0];
		var ul = document.createElement("ul");
		ul.classList.add("toolbar-group");
		ul.classList.add("pluggable-ops");
		var li = document.createElement("li");
		li.classList.add("toolbar-item");
		copyButton = document.createElement("a");
		copyButton.classList.add("toolbar-trigger");
		copyButton.classList.add("zeroclipboard-is-hover");
		copyButton.id = "copycopy";
		copyButton.textContent = "Copy summary*";
		container.appendChild(ul);
		ul.appendChild(li);
		li.appendChild(copyButton);
		console.log("Created the button");
	} else {
		console.log("Using existing button");
	}
	function copyClickAction() {
		var summaryText = document.getElementById("summary-val").textContent;
		var ticketId = getMeta("ajs-issue-key");
		var fullLink = document.location.origin + "/browse/" + ticketId;
		textResult = '[' + ticketId + '] ' + summaryText;
		htmlResult = '[<a href="' + fullLink + '">' + ticketId + '</a>] ' + summaryText;
		document.addEventListener('copy', handleCopyEvent);
		document.execCommand('copy');
		document.removeEventListener('copy', handleCopyEvent);
		return false;
	};
	copyButton.onclick = copyClickAction;
	async function keepHandlerAlive() {
		while (true) {
			var copyButton = document.getElementById("copycopy");
			if (copyButton.onclick == null) {
				console.log("Copy summary button died, resetting onclick...");
				copyButton.onclick = copyClickAction;
			}
			await sleep(1000);
		}
	};
	keepHandlerAlive();
})();
