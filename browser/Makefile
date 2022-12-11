#!/usr/bin/env bash -c make

DIST=../dist/cdate.min.js

all: $(DIST)

test: ../build/test-local.js
	../node_modules/.bin/mocha $<
	@echo '# open "browser/test.html"'

../dist/cdate.min.js: ../build/cdate.var.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 6 -o $@ $<
	ls -l $@

../dist/cdate.js: ../index.js
	../node_modules/.bin/rollup -f cjs -p "@rollup/plugin-node-resolve" $< > $@

../index.js: ../index.ts
	tsc -p ..

../build/cdate.var.js: ../dist/cdate.js wrap.cjs
	mkdir -p ../build
	grep -v END < wrap.cjs > $@
	cat $< | perl -pe 's#^(const) ((cdate|strftime) =)#/* $$1 */ $$2#' >> $@
	grep END < wrap.cjs >> $@
	ls -l $@

../build/package.json: ../dist/package.json
	mkdir -p ../build
	cat $^ > $@

../build/test-local.js: ../dist/cdate.min.js ../build/test.js
	cat $^ > $@

../build/test.js: ../build/test/000.before.js import.cjs
	../node_modules/.bin/browserify --list ../build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:../)+)(?:index.js)?("\))#$$1../browser/import.cjs$$2#' ] | sort
	../node_modules/.bin/browserify -o $@ ../build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:../)+)(?:index.js)("\))#$$1../browser/import.cjs$$2#' ]

../build/src/%.js: ../src/%.ts ../build/package.json
	../node_modules/.bin/tsc -p .

../build/test/%.js: ../test/%.ts ../build/package.json
	../node_modules/.bin/tsc -p .

TITLE:
	perl -i -pe '@f = split("/",$$ARGV); s#^const TITLE =.*#const TITLE = "$$f[-1]";#' ../test/*.ts

clean:
	/bin/rm -fr ../build $(DIST)

.PHONY: all clean test
