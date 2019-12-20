
build:
	@ npm run ts
	@ cat ./tmp/lib/*.d.ts > ./dist/types.d.ts
	@ npm run rollup
	@ ./scripts/replace
	@ rm -rf ./tmp

test:
	@ npm run lint
	@ npm run test

deploy:
	@ make build
	@ make test
	@ read -p 'Commit Message: ' commitMessage; \
		git add .; \
		git commit -am "$$commitMessage";
	@ read -p 'Version Bump (major, minor, patch): ' versionBump; \
		npm version $$versionBump;
	@ npm publish;
	@ git push origin master;
