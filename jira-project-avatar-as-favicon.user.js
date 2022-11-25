// ==UserScript==
// @name         Jira: Project icon as tab icon
// @namespace    http://tampermonkey.net/
// @version      1
// @license      MIT
// @description  Changes browser tab icon to JIRA project icon
// @author       Sergey Lukashevich
// @match        https://jira.example.com/browse/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let projectAvatar = document.getElementById('project-avatar');
    let shortcutIco = document.querySelector('link[rel="shortcut icon"]');
    if (projectAvatar && shortcutIco) {
        shortcutIco.href = projectAvatar.src;
    }
})();
