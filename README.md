Atlassian Tweaks
================

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
because it is too narrow.  This user style increases the width of the tooltip
to accommodate commit messages wrapped at 72 characters.  It is the commonly
used standard for commit message wrapping, which is used by
[Git](https://github.com/git/git/blob/master/.editorconfig#L15-L16) itself. It
is also the default wrapping width in some text editors, such as
[Vim](https://github.com/vim/vim/blob/master/runtime/ftplugin/gitcommit.vim#L13)
and [IntelliJ IDEA](https://github.com/JetBrains/intellij-community/blob/5544872539d351efcff26220579ff3dccf17cb2a/platform/vcs-impl/src/com/intellij/vcs/commit/message/BodyLimitInspection.java#L29-L31).

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fix-commit-toolip.user.css

![[Screenshot of "Fix commit tooltip"](images/bitbucket-fix-commit-tooltip.png)](images/bitbucket-fix-commit-tooltip.png)

### JIRA – improve formatting of inline code

Code in JIRA in `{{inline code}}` syntax can be hard to read sometimes.  This
user style adds a background and a border for such elements to improve
readability.

https://github.com/rybak/atlassian-tweaks/raw/main/jira-inline-code.user.css

### Bitbucket – fix selection of breadcrumbs
Selection of file paths (breadcrumbs) is broken in some parts of the Bitbucket
UI in a way, that marker "UPDATED", "ADDED", or "DELETED" is selected, depending
on the exact way that the user performs the selection.  This style makes the
pill-shaped markers unselectable, fixing this issue.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fix-breadcrumbs-selection.user.css

## User scripts

### JIRA – copy summary button
This user script adds or fixes a "Copy Summary" button for issue pages on JIRA.
When on a JIRA page, the script can be configured using the corresponding
extension menu item (screenshot from Tampermonkey):

[![JIRA copy summary Tampermonkey configuration][copy-summary-cfg]][copy-summary-cfg]

https://github.com/rybak/atlassian-tweaks/raw/main/jira_copy_summary.user.js

### Bitbucket – add convenient links to commits
This user script brings back convenient links to individual commit pages to the
pull request's "Diff" tab, which was removed by Atlassian some time before
Bitbucket version 7.6.  The commit link includes a fancy tooltip, same as
commit links on the "Commits" tab.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js

![[Screenshot of "PR links to commits"](images/bitbucket-pr-commit-links-screenshot-diff.png)](images/bitbucket-pr-commit-links-screenshot-diff.png)

### JIRA – better pull request links
Bitbucket integration in JIRA is not very convenient.  It requires clicking on a
link, like "3 pull requests", before actually giving the user access to the
actual links to pull requests.  This user script adds a panel above
"Development" with a list of clickable links to pull requests.

https://github.com/rybak/atlassian-tweaks/raw/main/jira-pr-links-improver.user.js

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

User scripts are compatible with browser extensions Violentmonkey,
Tampermonkey, and Greasemonkey.

## For styles
- Recommended – Stylus:
  - [Stylus for Chrome/Chromium](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
  - [Stylus for Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)

[WikipediaUserStyles]: https://en.wikipedia.org/wiki/Stylus_(browser_extension)
[Confluence]: https://www.atlassian.com/software/confluence
[Bitbucket]: https://bitbucket.org/product
[JIRA]: https://www.atlassian.com/software/jira
[copy-summary-cfg]: images/jira_copy_summary_cfg_tampermonkey.png
