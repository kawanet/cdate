#!/usr/bin/env bash -c make

DIST=../dist/cdate.min.js

# ../dist/locale/en_US.js
LOCALECJS=$(addprefix ../dist/locale/,$(addsuffix .js,$(notdir $(basename $(wildcard ../locale/*.ts)))))

all: $(DIST) $(LOCALECJS)

test: ../build/test-local.js
	../node_modules/.bin/mocha $<
	@echo '# open "browser/test.html"'

../dist/cdate.min.js: ../dist/cdate.js
	mkdir -p ../dist
	../node_modules/.bin/terser -c -m --ecma 6 -o $@ $<
	ls -l $@

# the below does NOT use browserify to get .min.js minified enough
../build/combined.js: ../build/src/cdate.js
	cat ../build/locale/en_US.js ../build/src/*/*.js ../build/src/*.js > $@
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@
	perl -i -pe 's#^(const \w+_1 = require.)#// $$&#' $@
	perl -i -pe 's#^exports\.(\w+ =)#const \$$$$1#g' $@
	perl -i -pe 's#(\W)((?:\w+_1|exports)\.)(\w)#$$1\$$$$3#g' $@
	perl -i -pe 's#(\W)\(0, (\$$\w+)\)(\()#$$1$$2$$3#' $@

../dist/cdate.js: ../build/combined.js wrap.cjs
	grep PRE < wrap.cjs | perl -pe 's#\s+//.*##' > $@
	grep -v '^//' $< >> $@
	grep -v PRE < wrap.cjs >> $@
	ls -l $@

../dist/locale/%.js: ../build/locale/%.js ../dist/locale/
	grep -v '^exports.*= void 0' < $< > $@

../dist/locale:
	mkdir -p ../dist/locale

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

../build/locale/%.js: ../locale/%.ts
	../node_modules/.bin/tsc -p .

../build/src/%.js: ../src/%.ts ../build/package.json
	../node_modules/.bin/tsc -p .

../build/test/%.js: ../test/%.ts ../build/package.json
	../node_modules/.bin/tsc -p .

TITLE:
	perl -i -pe '@f = split("/",$$ARGV); s#^const TITLE =.*#const TITLE = "$$f[-1]";#' ../test/*.ts

clean:
	/bin/rm -fr ../build $(DIST) $(LOCALECJS)

.PHONY: all clean test
