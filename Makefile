TEST_TIMEOUT = 2000
TEST_REPORTER = spec

test:
	@mocha --require should \
	       --timeout $(TEST_TIMEOUT) \
		   --reporter $(TEST_REPORTER) \

.PHONY: test
