#!/usr/bin/env bash -c make

all: dist test

dist: ../dist/cdate.min.js

../dist/cdate.min.js: ../build/bundle.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 5 -o $@ $<

../build/bundle.js: ../build/src/cdate.js
	../node_modules/.bin/browserify --list $<
	../node_modules/.bin/browserify -s cdate -o $@ $<

../build/bundle2.js: ../build/src/cdate.js
	echo 'var cdate = (function(exports) {' > $@
	cat $< >> $@
	echo 'return cdate;})("undefined" !== typeof exports ? exports : {})' >> $@
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@

test: dist ../build/test.js

../build/test.js: ../build/src/cdate.js ../browser/import.js
	perl -i -pe 's#require\("../"\)#require("../../browser/import")#' ../build/test/*.js
	../node_modules/.bin/browserify -o ../build/test.js ../build/test/*.js

../build/src/cdate.js: ../src/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ../browser

clean:
	/bin/rm -fr ../build ../dist/*.js ../src/*.js ../test/*.js

.PHONY: all clean test
