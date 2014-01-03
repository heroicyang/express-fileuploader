TESTS = 'test/*.test.js'
REPORTER = spec
TIMEOUT = 15000
REQUIRE_OPTS =

install:
	@npm install

test: install
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(REQUIRE_OPTS) \
		$(TESTS)

test-cov:
	@$(MAKE) test REQUIRE_OPTS='--require test/instrument' REPORTER=travis-cov

test-cov-html:
	@rm -f coverage.html
	@$(MAKE) test REQUIRE_OPTS='--require test/instrument' REPORTER=html-cov > coverage.html
	@ls -lh coverage.html

test-coveralls: test
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@-$(MAKE) test REQUIRE_OPTS='--require test/instrument' REPORTER=mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

test-all: test test-cov

.PHONY: test