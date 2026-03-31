.PHONY: test test-headed test-ui test-debug test-codegen test-report serve

test:
	npx playwright test

test-headed:
	npx playwright test --headed

test-ui:
	npx playwright test --ui

test-debug:
	npx playwright test --debug

test-codegen:
	npx playwright codegen http://localhost:3000

test-report:
	npx playwright show-report

serve:
	npx serve
