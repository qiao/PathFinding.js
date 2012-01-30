TEST_TIMEOUT = 2000
TEST_REPORTER = spec

test:
	@NODE_ENV=test \
		./node_modules/.bin/mocha \
			--require should \
			--timeout $(TEST_TIMEOUT) \
			--reporter $(TEST_REPORTER) 

.PHONY: test
