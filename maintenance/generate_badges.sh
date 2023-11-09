#!/bin/bash

str_id_to_badge_ref_name () {
	local str_id="$1"
	echo "badge_${str_id}"
}

str_id_to_gfork_ref_name () {
	local str_id="$1"
	echo "gfork_${str_id}"
}

base_url='https://img.shields.io/badge/dynamic/json?style=flat&color=670000&label=Version&query=version&url=https%3A%2F%2Fgreasyfork.org%2Fscripts%2F'

num_id_to_badge_url () {
	local num_id="$1"
	echo "${base_url}${num_id}.json"
}

print_gfork_reference () {
	local str_id=$1
	local gfork_url=$2
	local gfork_ref_name="$(str_id_to_gfork_ref_name "$str_id")"
	echo "[$gfork_ref_name]: $gfork_url"
}

print_badge_reference () {
	local str_id=$1
	local num_id=$2
	local badge_url="$(num_id_to_badge_url $num_id)"
	local badge_ref_name="$(str_id_to_badge_ref_name "$str_id")"
	echo "[$badge_ref_name]: $badge_url"
}

print_button () {
	local str_id="$1"
	local badge_ref_name="$(str_id_to_badge_ref_name "$str_id")"
	local gfork_ref_name="$(str_id_to_gfork_ref_name "$str_id")"
	echo "[![Greasy fork link][$badge_ref_name]][$gfork_ref_name]"
}

button_file=/tmp/buttons.txt
ref_file=/tmp/references.txt

>"$button_file"
>"$ref_file"

cat greasy-fork-urls.txt | while read url
do
	echo "$url"
	num_id="${url:34:6}"
	str_id="${url:41}"
	print_button "$str_id" >>"$button_file"
	print_badge_reference "$str_id" "$num_id" >>"$ref_file"
	print_gfork_reference "$str_id" "$url" >>"$ref_file"
done

cat "$button_file"
cat "$ref_file"
