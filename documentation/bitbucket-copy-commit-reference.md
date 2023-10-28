Adds "Copy commit reference" link to every commit page. Commit reference is a
commonly used [format][git-log-formats] to refer to past commits. It looks like
this:

> the example is [commit `1f0fc1d (pretty: implement 'reference' format, 2019-11-20)`](https://github.com/git/git/commit/1f0fc1db8599f87520494ca4f0e3c1b6fabdf997)
> in the git.git repository.

The copied reference supports plain text and rich text editors, with clickable
links to the commit, Jira issues, and Bitbucket pull requests.

This script supports both Bitbucket Server and Bitbucket Cloud.

https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-copy-commit-reference.user.js

[![Screenshot of "Bitbucket: copy commit reference" in action](images/bitbucket-copy-commit-reference.png)](https://github.com/rybak/atlassian-tweaks/raw/main/bitbucket-copy-commit-reference.user.js)

[git-log-formats]: https://git-scm.com/docs/git-log#_pretty_formats
