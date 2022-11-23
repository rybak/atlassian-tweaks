// ==UserScript==
// @name         Jira: Copy code blocks
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Copy code blocks in Jira code blocks and Zephyr test steps.
// @author       Andrei Rybak
// @match        https://jira.example.com/secure/enav/*
// @match        https://jira.example.com/browse/*
// @homepageURL  https://github.com/rybak/atlassian-tweaks
//
// ==/UserScript==

/*
 * Copyright (c) 2022 Andrei Rybak
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

(async function () {
	'use strict';

	// https://stackoverflow.com/a/39914235/1083697
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	var textResult = '';
	var htmlResult = '';

	function log(msg) {
		console.log("[Jira code copy] " + msg);
	}

	function handleCopyEvent(e) {
		var clipboardData;

		// Stop event propagation
		e.stopPropagation();
		e.preventDefault();

		clipboardData = e.clipboardData || window.clipboardData;
		clipboardData.setData('text/plain', textResult);
		clipboardData.setData('text/html', htmlResult);
	}

	function copyClickAction(text) {
		// remove newlines to avoid immediately executing commands when pasting into a terminal
		text = text.trim();
		if (false) {
			navigator.clipboard.writeText(text);
		} else {
			textResult = text;
			htmlResult = '<pre>' + text + '</pre>';
			document.addEventListener('copy', handleCopyEvent);
			document.execCommand('copy');
			document.removeEventListener('copy', handleCopyEvent);
		}
		log("Copied: " + text.slice(0, 20));
	}

	function createButton(div) {
		var button = $('<button style="user-select:none;">Copy!</button>');
		button.click((e) => {
			event.preventDefault();
			const text = div.find('pre').text();
			copyClickAction(text);
		});
		div.append(button);
		log("Created button for: " + div.find('pre').text().slice(0, 20));
	}

	function createButtons() {
		log("Creating buttons...");
		$('.preformatted, .codeContent').each((i, e) => {
			log("Button #" + i + "...");
			createButton($(e));
			log("Button #" + i + " is done");
		});
		log("Created buttons.");
	}

	await sleep(2000); // FIXME: wait for async download of test steps
	createButtons();

})();

