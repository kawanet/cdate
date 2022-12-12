#!/usr/bin/env bash -c make

MINJS=./dist/cdate.min.js
CJS=./dist/cdate.js
TYPES=./types/cdate.d.ts
WRAP=./browser/wrap.cjs

all: $(MINJS) $(TYPES)

test: ./build/test-local.js
	./node_modules/.bin/mocha $<
	@echo '# open "browser/test.html"'

$(MINJS): ./build/cdate.tmp.js
	mkdir -p ./dist
	./node_modules/.bin/terser -c -m --ecma 6 -o $@ $<
	ls -l $@

$(TYPES): index.ts
	grep -v "^import" < $< | perl -pe 's#^(export.*) =.*#$$1;#' > $@

$(CJS): index.js
	./node_modules/.bin/rollup -f cjs -p "@rollup/plugin-node-resolve" $< > $@

./index.js: index.ts
	tsc -p ..

./build/cdate.tmp.js: $(CJS) $(WRAP)
	mkdir -p ./build
	grep -v END < $(WRAP) > $@
	cat $< | perl -pe 's#^(const) ((cdate|strftime) =)#/* $$1 */ $$2#' >> $@
	grep END < $(WRAP) >> $@
	ls -l $@

./build/package.json: ./dist/package.json
	mkdir -p ./build
	cat $^ > $@

./build/test-local.js: $(MINJS) ./build/test.js
	cat $^ > $@

./build/test.js: ./build/test/000.before.js ./browser/import.cjs
	./node_modules/.bin/browserify --list ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:./)+)(?:index.js)?("\))#$$1./browser/import.cjs$$2#' ] | sort
	./node_modules/.bin/browserify -o $@ ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:./)+)(?:index.js)("\))#$$1./browser/import.cjs$$2#' ]

./build/src/%.js: ./src/%.ts ./build/package.json
	./node_modules/.bin/tsc -p .

./build/test/%.js: ./test/%.ts ./build/package.json
	./node_modules/.bin/tsc -p .

TITLE:
	perl -i -pe '@f = split("/",$$ARGV); s#^const TITLE =.*#const TITLE = "$$f[-1]";#' ./test/*.ts

clean:
	/bin/rm -fr ./build $(MINJS) $(TYPES)

.PHONY: all clean test
