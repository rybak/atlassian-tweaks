#!/bin/bash

# Check metadata of userscripts and userstyles
#
# Used by GitHub Actions. Can be used locally:
#
#	$ ./maintenance/check-metadata.sh

set -e
set -u

error () {
	>&2 echo "ERROR: " "$@"
}

has_metadata_entry () {
	# .user.jss files have slashes and spaces at the start of the line,
	# but .user.css files do not
	grep -q -E "^[/ ]*@${1}" "${2}"
}

has_version () {
	has_metadata_entry 'version  *[0-9.-]+' "$1"
}

has_license () {
	has_metadata_entry 'license  *' "$1"
}

has_namespace () {
	# some have https://github.com/rybak/atlassian-tweaks while others
	# have https://github.com/rybak, without the repository name
	# both are fine
	has_metadata_entry 'namespace  *https://github.com/rybak' "$1"
}

has_homepageURL () {
	has_metadata_entry 'homepageURL  *https://github.com/rybak/atlassian-tweaks' "$1"
}

check () {
	if ! $1 "$2"
	then
		error "$3"
		res=false
	fi
}

GITHUB_URL=https://github.com/rybak/atlassian-tweaks

res=true
for f in *.user.js *.user.css
do
	check has_version "$f" "File '$f' is missing @version"
	check has_license "$f" "File '$f' is missing @license"
	check has_namespace "$f" "File '$f' is missing @namespace $GITHUB_URL"
	check has_homepageURL "$f" "File '$f' is missing @homepageURL $GITHUB_URL"
done

$res
