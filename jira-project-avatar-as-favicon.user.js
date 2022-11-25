// ==UserScript==
// @name         Jira: Project icon as tab icon
// @namespace    http://tampermonkey.net/
// @version      1
// @license      MIT
// @description  Changes browser tab icon to JIRA project icon
// @author       Sergey Lukashevich
// @match        https://jira.example.com/browse/*
// @match        https://jira.example.com/projects/*
// @icon         https://jira.atlassian.com/favicon.ico
// @homepageURL  https://github.com/rybak/atlassian-tweaks
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let projectAvatar = document.getElementById('project-avatar');
    if (!projectAvatar) {
        let elements = document.getElementsByClassName('aui-avatar-project');
        if (elements.length === 1) {
            let byTagName = elements[0].getElementsByTagName('img');
            if (byTagName.length === 1) {
                projectAvatar = byTagName[0];
            }
        }
    }
    let shortcutIco = document.querySelector('link[rel="shortcut icon"]');
    if (projectAvatar && shortcutIco) {
        shortcutIco.href = projectAvatar.src;
    }
})();
