#!/bin/bash

if [ -z "$1" ]; then
    echo "Missing destpath"

    exit 1
fi

destpath="$1"

if [ ! -e "$destpath" ]; then
    echo "$1 doesn't exists"

    exit 1

fi

cd $destpath

git pull