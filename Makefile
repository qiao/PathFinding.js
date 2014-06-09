SRC = $(shell find src -name "*.js" -type f)
TEST_TIMEOUT = 2000
TEST_REPORTER = spec

lib/pathfinding-browser.js: $(SRC)
	@mkdir -p lib
	@node utils/build.js

test:
	@NODE_ENV=test \
		./node_modules/.bin/mocha \
			--require should \
			--timeout $(TEST_TIMEOUT) \
			--reporter $(TEST_REPORTER) \
			--bail

clean:
	rm -f lib/pathfinding-browser.js

.PHONY: test clean
