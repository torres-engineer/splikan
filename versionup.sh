#!/bin/sh

VERSION=$(cat VERSION)

if [ -f "CITATION.cff" ]; then
    sed -i "/^version:/c\version: $VERSION" CITATION.cff
fi
