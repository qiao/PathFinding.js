#!/bin/sh

echo Generating documents ...

cd `dirname $0`/..
./utils/jsdoc/jsdoc -r ./src -d ./doc
cd ./doc
cp PF.html index.html

echo Done.
