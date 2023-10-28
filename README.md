Atlassian Tweaks
================

This is a collection of [user scripts](https://en.wikipedia.org/wiki/Userscript)
and [user styles][WikipediaUserStyles] for [Bitbucket][Bitbucket],
[Confluence][Confluence], and [Jira][Jira].

The source code is distributed under the terms of [MIT](LICENSE.txt) or
[AGPL-3.0-only](LICENSE-AGPL-3.0-only.txt) licenses, depending on the file.
See individual scripts and styles for details.

Instructions on how to use user scripts and styles are at the bottom of the README.

Half of the scripts and styles support both the old-school self-hosted and the
newer cloud variants of Bitbucket, Jira, and Confluence – they are marked as
such in their description.  Some scripts and styles are no longer applicable to
newer cloud variants due to significant UI redesigns.

## Userscripts and userstyles

| Name                                                                                                 | Version                                                                                    | Install |
|------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|---------|
| [Bitbucket: copy commit reference](./documentation/bitbucket-copy-commit-reference.md)               | [![][BitbucketVersion]][BitbucketGreasyFork] [![][BitbucketInstalls]][BitbucketGreasyFork] |
| [Bitbucket: hide banner](./documentation/bitbucket-hide-banner.md)                                   |                                                                                            |         |
| [Bitbucket: fix commit tooltip](./documentation/bitbucket-fix-commit-tooltip.md)                     |                                                                                            |         |
| [Bitbucket: fix selection of breadcrumbs](./documentation/bitbucket-fix-breadcrumbs-selection.md)    |                                                                                            |         |
| [Bitbucket: commit links in diff tab of PRs](./documentation/bitbucket-pull-request-commit-links.md) |                                                                                            |         |
| [Bitbucket: header color](./documentation/bitbucket-header-color.md)                                 |                                                                                            |         |
| [Bitbucket: PR author avatar as favicon](./documentation/bitbucket-pull-request-avatars.md)          |                                                                                            |         |
| [Bitbucket: readable commit messages](./documentation/bitbucket-readable-commit-messages.md)         |                                                                                            |         |
| [Bitbucket: speed up CI builds](./documentation/bitbucket-fast-and-furious.md)                       |                                                                                            |         |
| [Confluence: space avatar as tab icon](./documentation/confluence-space-avatar-favicons.md)          |                                                                                            |         |
| [Confluence: copy link buttons](./documentation/confluence-copy-link-buttons.md)                     |                                                                                            |         |
| [Confluence: hide banner](./documentation/confluence-hide-banner.md)                                 |                                                                                            |         |
| [Confluence: better monospace](./documentation/confluence-better-monospace.md)                       |                                                                                            |         |
| [Confluence: Simple Floating Table of Contents](./documentation/confluence-simple-floating-toc.md)   |                                                                                            |         |
| [Jira: improve formatting of inline code](./documentation/jira-inline-code.md)                       |                                                                                            |         |
| [Jira: copy summary button](./documentation/jira-copy-summary.md)                                    |                                                                                            |         |
| [Jira: copy code blocks](./documentation/jira-copy-code-blocks.md)                                   |                                                                                            |         |
| [Jira: better pull request links](./documentation/jira-pr-links-improver.md)                         |                                                                                            |         |
| [Jira: project avatar as favicon](./documentation/jira-project-avatar-as-favicon.md)                 |                                                                                            |         |

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
[BitbucketGreasyFork]: https://greasyfork.org/en/scripts/470667-bitbucket-copy-commit-reference
[BitbucketInstalls]: https://img.shields.io/badge/dynamic/json?style=flat&color=670000&label=Installs&query=total_installs&url=https%3A%2F%2Fgreasyfork.org%2Fscripts%2F470667.json
[BitbucketVersion]: https://img.shields.io/badge/dynamic/json?style=flat&color=670000&label=Version&query=version&url=https%3A%2F%2Fgreasyfork.org%2Fscripts%2F470667.json
