Atlassian Tweaks
================

This is a collection of [user scripts](https://en.wikipedia.org/wiki/Userscript)
and [user styles][WikipediaUserStyles] for [Bitbucket][Bitbucket],
[Confluence][Confluence], and [Jira][Jira].  The source code is distributed
under the terms of the MIT Licence.  See [LICENSE.txt](LICENSE.txt) for details.

Instructions on how to use user scripts and styles are at the bottom of the README.

Most of the scripts and styles support only the old-school self-hosted variants
of Bitbucket, Jira, and Confluence.  Some of the scripts and styles support the
new cloud-based variants – they are marked as such in their description.

## Bitbucket

### Hide Bitbucket banner

Hides the banner at the top of Bitbucket which takes up vertical space in cases
when it is almost never used.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-hide-banner.user.css

### Bitbucket – fix commit tooltip

The width of commit tooltip in Bitbucket can sometimes make it unreadable
because it is too narrow.  This user style increases the width of the tooltip
to accommodate commit messages wrapped at 72 characters.  It is the commonly
used standard for commit message wrapping, which is used by
[Git](https://github.com/git/git/blob/master/.editorconfig#L15-L16) itself. It
is also the default wrapping width in some text editors, such as
[Vim](https://github.com/vim/vim/blob/master/runtime/ftplugin/gitcommit.vim#L13)
and [IntelliJ IDEA](https://github.com/JetBrains/intellij-community/blob/5544872539d351efcff26220579ff3dccf17cb2a/platform/vcs-impl/src/com/intellij/vcs/commit/message/BodyLimitInspection.java#L29-L31).

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fix-commit-tooltip.user.css

[![Screenshot of "Fix commit tooltip"](images/bitbucket-fix-commit-tooltip.png)](https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fix-commit-tooltip.user.css)

### Bitbucket – fix selection of breadcrumbs
Selection of file paths (breadcrumbs) is broken in some parts of the Bitbucket
UI in a way, that marker "UPDATED", "ADDED", or "DELETED" is selected, depending
on the exact way that the user performs the selection.  This style makes the
pill-shaped markers unselectable, fixing this issue.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fix-breadcrumbs-selection.user.css

### Bitbucket – commit links in diff tab of PRs
This user script brings back convenient links to individual commit pages to the
pull request's "Diff" tab, which was removed by Atlassian some time before
Bitbucket Server version 7.6.  The commit link includes a fancy tooltip, same as
commit links on the "Commits" tab.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js

[![Screenshot of "PR links to commits"](images/bitbucket-pr-commit-links-screenshot-diff.png)](https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-commit-links.user.js)

### Bitbucket – header color
Some instances of Bitbucket are deployed with custom look and feels, which have
unfortunate color of the header.  This user style allows changing the color of
Bitbucket header to any color.

This style supports both Bitbucket Server and Bitbucket Cloud.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-header-color.user.css

[![Screenshot of "Bitbucket: header color"](images/bitbucket-header-color-rgb.png)](https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-header-color.user.css)

### Bitbucket – PR author avatar as favicon
This user script changes favicons of Bitbucket pull request pages (tab icon in
browsers) to the avatar of pull request's author, which makes it easier to
distinguish browser tabs.

This script supports both Bitbucket Server and Bitbucket Cloud.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-avatars.user.js

[![Screenshot of "Bitbucket: PR author avatar as favicon"](images/bitbucket-pull-request-avatars.png)](https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-pull-request-avatars.user.js)

### Bitbucket – speed up CI builds
This user style speeds up continuous integration builds on Bitbucket.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fast-and-furious.user.css

[![Demonstration of "Bitbucket: fast and furious"](images/bitbucket-fast-and-furious.gif)](https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-fast-and-furious.user.css)

## Confluence

### Hide Confluence banner

Hides the "precursor" banner at the top of Confluence which takes up vertical
space in cases when it is almost never used.

https://github.com/rybak/atlassian-tweaks/raw/main/confluence-hide-banner.user.css

### Better monospace

This style adds a border and a background to monospace text, making it easier
to distinguish from surrounding text.

https://github.com/rybak/atlassian-tweaks/raw/main/confluence-better-monospace.user.css

[![Screenshot of "Confluence: better monospace"](images/confluence-better-monospace.png)](https://github.com/rybak/atlassian-tweaks/raw/main/confluence-better-monospace.user.css)

### Confluence – Simple Floating Table of Contents

This style moves the table of contents to the right side of the page and makes
the table of contents "sticky", floating in the same place when scrolling.

https://github.com/rybak/atlassian-tweaks/raw/main/confluence-simple-floating-toc.user.css

https://user-images.githubusercontent.com/624072/211896771-f93fd25a-a199-4bb0-9766-46dfe09438ce.mp4

## Jira

### Jira – improve formatting of inline code

Code in Jira in `{{inline code}}` syntax can be hard to read sometimes.  This
user style adds a background and a border for such elements to improve
readability.

[![Screenshot comparing sample text with and without user style "Jira: improve formatting of inline code"](images/jira-monospace.png)](https://github.com/rybak/atlassian-tweaks/raw/main/jira-inline-code.user.css)

https://github.com/rybak/atlassian-tweaks/raw/main/jira-inline-code.user.css

### Jira – copy summary button
This user script adds or fixes a "Copy Summary" button for issue pages on Jira.
When on a Jira page, the script can be configured using the corresponding
extension menu item (screenshot from Tampermonkey):

[![Jira copy summary Tampermonkey configuration][copy-summary-cfg]](https://github.com/rybak/atlassian-tweaks/raw/main/jira_copy_summary.user.js)

https://github.com/rybak/atlassian-tweaks/raw/main/jira_copy_summary.user.js

### Jira – copy code blocks
This user scripts adds a "Copy!" button to all code and preformatted blocks in
Jira to allow copying its contents.  Useful for copying commands when executing
Zephyr test cases.

https://github.com/rybak/atlassian-tweaks/raw/main/jira-copy-code-blocks.user.js

### Jira – better pull request links
Bitbucket integration in Jira is not very convenient.  It requires clicking on a
link, like "3 pull requests", before actually giving the user access to the
actual links to pull requests.  This user script adds a panel above
"Development" with a list of clickable links to pull requests.

https://github.com/rybak/atlassian-tweaks/raw/main/jira-pr-links-improver.user.js

[![Screenshot of "Jira: Pull Request Link Improver"](images/jira-pr-link-improver.png)](https://github.com/rybak/atlassian-tweaks/raw/main/jira-pr-links-improver.user.js)

### Jira – project avatar as favicon
This user script changes favicons of Jira pages (tab icon in browsers) to the
avatar of individual Jira projects, which makes it easier to distinguish browser
tabs of tickets in different projects.

This script supports both Jira Server (self-hosted) and Jira Cloud.

https://github.com/rybak/atlassian-tweaks/raw/main/jira-project-avatar-as-favicon.user.js

[![Screenshot of "Jira: project avatar as favicon"](images/jira-project-avatar-as-favicon.png)](https://github.com/rybak/atlassian-tweaks/raw/main/jira-project-avatar-as-favicon.user.js)

## How to use Atlassian Tweaks

1. Install browser extensions for user scripts and user styles.
2. Click on the link for the user script or user style in the sections above.
   The corresponding browser extension will automatically recognize the filename
   extension in the link and prompt you for its installation.

After installation, you can use the browser extension popup to disable or
enable individual scripts and styles if needed.  For some scripts, you will
need to refresh the page (in browser) to remove effects of the script.

### Custom domains

Both scripts and styles should automatically work on Bitbucket, Confluence, and
Jira domains which have `bitbucket`, `confluence`, or `jira` in their domain
name.  If a style or script doesn't work automatically, for example, if your
Bitbucket server lives on a domain without the word `bitbucket` in it, you will
have to add your domain manually.

Also, the automagical `@include` rules which scripts of Atlassian Tweaks use
might break in future versions of Chrome due to adoption of Manifest V3 for
browser extensions.  See documentation of [Firefox][firefox-patterns] and
[Google Chrome][chrome-patterns] for details.

#### Custom domains for user styles

For styles, if URL of your Bitbucket, Confluence, of Jira instance doesn't start
with `bitbucket`, `confluence`, or `jira` respectively, you'll have to manually
provide your domain.  Stylus instructions:

1. Click "Manage" button in the extension's menu
2. Click on cog icon in the row of the style that you need to adjust
3. In field "Your Bitbucket/Confluence/Jira domain", type in the domain of
   your Bitbucket, Confluence, or Jira server.  For example,
   `git.example.com` or `bugs.example.com`.  Up to two domains are supported.
   This menu should also be visible in the top right corner of the tab
   during installation of the style.

#### Custom domains for user scripts

Scripts use https://example.com by default. You might have to manually change
the URL in the "match" settings to the hostname of the Bitbucket, Jira, or
Confluence server that you use.

Tampermonkey instructions:

   1. Go to Dashboard in the extension menu
   2. Click "Edit" button in the line of the script that you've just installed
   3. Copy the value from `@match` field of the metadata
   4. Go to the tab "Settings"
   5. Click "Add..." under "User matches"
   6. Paste the copied value
   7. Replace the example domain with the domain of website you use
   8. Click "OK"

### Browser extensions

#### For scripts
- Recommended: https://www.tampermonkey.net/
- Big list of different extensions for different browsers available on
  https://greasyfork.org

User scripts are compatible with browser extensions Violentmonkey,
Tampermonkey, and Greasemonkey.

#### For styles
- Recommended – Stylus:
  - [Stylus for Chrome/Chromium](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
  - [Stylus for Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/)

[WikipediaUserStyles]: https://en.wikipedia.org/wiki/Stylus_(browser_extension)
[Confluence]: https://www.atlassian.com/software/confluence
[Bitbucket]: https://bitbucket.org/product
[Jira]: https://www.atlassian.com/software/jira
[copy-summary-cfg]: images/jira_copy_summary_cfg_tampermonkey.png
[chrome-patterns]: https://developer.chrome.com/docs/extensions/mv3/match_patterns/
[firefox-patterns]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
