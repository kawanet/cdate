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

all: $(ALL)

%.ts:
	node ../cli/make-locale $(subst _,-,$(basename $@)) > $@

clean:
	/bin/rm -fr $(ALL)

.PHONY: all clean test
