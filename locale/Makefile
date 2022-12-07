#!/usr/bin/env bash -c make

ALL=\
	de_DE.ts \
	en_US.ts \
	es_ES.ts \
	fr_FR.ts \
	it_IT.ts \
	ja_JP.ts \
	ko_KR.ts \
	nl_NL.ts \
	pt_PT.ts \

INDEX=index.ts

all: en_US.js $(INDEX)

en_US.js:
	echo 'export const en_US = {}' > en_US.js # dummy

index.ts: $(ALL)
	echo "// cdate/locale" > $@
	echo "" >> $@
	for f in $(ALL:.ts=); do echo "import {$$f} from \"./$$f.js\";" >> $@; done
	echo "" >> $@
	echo "export const locales = {$(ALL:.ts=,)};" >> $@

%.ts:
	node ../cli/make-locale $(subst _,-,$(basename $@)) > $@

clean:
	/bin/rm -fr *.ts *.js

.PHONY: all clean test
