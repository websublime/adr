#!/bin/bash
CURRENT=`dirname "$BASH_SOURCE"`

cd $CURRENT

rm -rf @types
rm -rf dist

echo "Compiling..."
yarn compile

mkdir ./dist/lib/templates

echo "Copy templates..."
cp ./lib/templates/* ./dist/lib/templates/
# cp ./lib/helpers/export_template.html ./dist/lib/helpers/

echo "Type definitions..."
yarn rollup
