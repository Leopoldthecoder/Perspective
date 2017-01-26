.PHONY: dist test

dev:
	@npm run dev

dist:
	@npm run dist

test:
	@./node_modules/.bin/nyc npm test
