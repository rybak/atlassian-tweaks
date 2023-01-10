#!/bin/bash

# Increments first number in the metadata field "@version" of user scripts and
# user styles.
#
# Usage
#     ./increment-version.sh FILE...


if [[ $# -lt 1 ]]
then
	echo "Specify a file" >&2
	exit 1
fi

while [[ $# -gt 0 ]]
do
	file=$1
	shift

	if [[ ! -w "$file" ]]
	then
		echo "Can't write to file '$file'" >&2
		exit 2
	fi

	count=$(grep -c '@version' "$file")
	if [[ $count -ne 1 ]]
	then
		echo "Found $c @version tags in '$file'. Should be only one." >&2
		exit 3
	fi

	versionNum=$(grep -o '@version *[0-9][0-9]*' "$file" | grep -o '[0-9]*')
	let newVersionNum=versionNum+1
	echo -e "$versionNum -> $newVersionNum\t$file"
	sed -i .bak -e "s_\(@version *\)${versionNum}_\1${newVersionNum}_" "$file"
done
