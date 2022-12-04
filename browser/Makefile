#!/usr/bin/env bash -c make

all: dist test

dist: ../dist/cdate.min.js

../dist/cdate.min.js: ../build/bundle.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 6 -o $@ $<
	ls -l $@

../build/bundle.js: ../build/src/cdate.js wrap.js
	grep PRE < wrap.js > $@
	cat ../build/locale/en_US.js ../build/src/*.js >> $@
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@
	perl -i -pe 's#^(const .*_1 = require.)#// $$&#' $@
	perl -i -pe 's#(\W)(\w+_1\.)(\w)#$$1 /* $$2 */ $$3#g' $@
	perl -i -pe 's#^(exports\.\w+ = \w+;)#// $$&#' $@
	perl -i -pe 's#^(exports\.)(\w+)#const /* $$1 */ $$2#' $@
	grep -v PRE < wrap.js >> $@
	ls -l $@

test: dist ../build/test.js

../build/test.js: ../build/src/cdate.js ../browser/import.js
	perl -i -pe 's#require\("../"\)#require("../../browser/import")#' ../build/test/*.js
	../node_modules/.bin/browserify --list ../build/test/*.js | sort
	../node_modules/.bin/browserify -o ../build/test.js ../build/test/*.js

../build/src/cdate.js: ../src/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ../browser

clean:
	/bin/rm -fr ../build ../dist/*.js ../src/*.js ../test/*.js

.PHONY: all clean test
