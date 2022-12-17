#!/usr/bin/env bash -c make

MINJSGZ=./dist/cdate.min.js.gz
MINJS=./dist/cdate.min.js
CJS=./dist/cdate.js
WRAP=./browser/wrap.cjs

all: $(CJS) $(MINJSGZ)

test: test-title mocha test-cjs test-minjs test-browser

# test index.js (ESM) on node.js
mocha: ./test/000.before.js
	./node_modules/.bin/mocha test/*.js

# test cdate.js (CJS) on node.js
test-cjs: ./build/test-cjs.js
	./node_modules/.bin/mocha $<

# test cdate.min.js on node.js
test-minjs: ./build/test-minjs.js
	./node_modules/.bin/mocha $<

# test cdate.min.js on web browsers
test-browser: ./build/test-browser.js
	@echo '# open "browser/test.html"'

$(MINJSGZ): $(MINJS)
	gzip < $< > $@
	ls -l $@

$(MINJS): ./build/cdate.tmp.js
	./node_modules/.bin/terser -c -m --ecma 6 -o $@ $<
	ls -l $@

$(CJS): ./index.js src/cdate.js
	./node_modules/.bin/rollup -f cjs -p "@rollup/plugin-node-resolve" -o $@ $<
	ls -l $@

./src/%.js: ./src/%.ts
	./node_modules/.bin/tsc -p .

./test/%.js: ./test/%.ts
	./node_modules/.bin/tsc -p .

./build/cdate.tmp.js: $(CJS) $(WRAP)
	mkdir -p ./build
	grep -v END < $(WRAP) > $@
	cat $< | perl -pe 's#^(const) ((cdate|strftime) =)#/* $$1 */ $$2#' >> $@
	grep END < $(WRAP) >> $@

./build/package.json: ./dist/package.json
	mkdir -p ./build
	cat $^ > $@

# test script for cdate.min.js on web browsers
./build/test-browser.js: ./build/test/000.before.js ./browser/import.cjs $(MINJS)
	./node_modules/.bin/browserify --list ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:\.+/)+)(?:index.js)?("\))#$$1../browser/import.cjs$$2#' ] | sort
	./node_modules/.bin/browserify -o $@ ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:\.+/)+)(?:index.js)("\))#$$1../browser/import.cjs$$2#' ]

# test script for cdate.min.js on node.js
./build/test-minjs.js: ./build/test/000.before.js $(MINJS)
	./node_modules/.bin/browserify --list ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:\.+/)+)(?:index.js)?("\))#$$1../$(MINJS)$$2#' ] | sort
	./node_modules/.bin/browserify -o $@ ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:\.+/)+)(?:index.js)("\))#$$1../$(MINJS)$$2#' ]

# test script for cdate.js on node.js
./build/test-cjs.js: ./build/test/000.before.js $(CJS)
	./node_modules/.bin/browserify --list ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:\.+/)+)(?:index.js)?("\))#$$1../$(CJS)$$2#' ] | sort
	./node_modules/.bin/browserify -o $@ ./build/test/*.js \
	-t [ browserify-sed 's#(require\("(?:\.+/)+)(?:index.js)("\))#$$1../$(CJS)$$2#' ]

./build/src/%.js: ./src/%.ts ./build/package.json
	./node_modules/.bin/tsc -p browser

./build/test/%.js: ./test/%.ts ./build/package.json
	./node_modules/.bin/tsc -p browser

test-title:
	perl -i -pe '@f = split("/",$$ARGV); s#^const TITLE =.*#const TITLE = "$$f[-1]";#' ./test/*.ts

clean:
	/bin/rm -fr ./build $(CJS) $(MINJS)

.PHONY: all clean test
