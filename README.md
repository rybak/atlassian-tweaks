Atlassian Tweaks
===================

This is a collection of [user scripts](https://en.wikipedia.org/wiki/Userscript)
and [user styles][WikipediaUserStyles] for [Confluence][Confluence],
[Bitbucket][Bitbucket], and [JIRA][JIRA].

## User styles

### Hide Bitbucket/Confluence banner

Hides the annoying banner at the top of Confluence and
Bitbucket which takes up vertical space.

https://github.com/rybak/atlassian-tweaks/raw/main/hide-bitbucket-confluence-banner.user.css

### Bitbucket – fix commit tooltip

The width of commit tooltip in Bitbucket can sometimes make it unreadable
because it is too narrow.  This user style increases the width of the tooltip to
accommodate the 72 characters wide (default setting for formatting in IntelliJ
IDEA) commit messages.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fix-commit-toolip.user.css

## User scripts

### Bitbucket – add convenient links to commits
Currently, we are using Bitbucket v7.6.8.  This user script brings back
convenient links to individual commit pages to the pull request's "Diff" view,
which was removed by Atlassian.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js

## How to use Atlassian Tweaks
1. Install browser extensions for user scripts and user styles.
2. Click on the link for the user script or user style in the sections above.
   The corresponding browser extension will automatically recognize the filename
   extension in the link and prompt you for its installation.
3. After installation, you can use the browser extension popup to disable or
   enable individual scripts and styles if needed.  For some scripts, you will
   need to refresh the page (in browser) to remove effects of the script.

# Browser extensions

## For scripts
- Recommended: https://www.tampermonkey.net/
- Big list of different extensions for different browsers available on
  https://greasyfork.org

## For styles
- Recommended – Stylus:
  - [Stylus for Chrome/Chromium](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
  - [Stylus for Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)

[WikipediaUserStyles]: https://en.wikipedia.org/wiki/Stylus_(browser_extension)
[Confluence]: https://www.atlassian.com/software/confluence
[Bitbucket]: https://bitbucket.org/product
[JIRA]: https://www.atlassian.com/software/jira
