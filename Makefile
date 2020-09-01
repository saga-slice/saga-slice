build:
	@ npm run ts
	@ cat ./tmp/lib/*.d.ts > ./dist/types.d.ts
	@ npm run rollup
	# @ ./scripts/replace
	@ rm -rf ./tmp

deploy:
	@ make build
	@ npm run test
	@ npm run test:dist
	@ npm run commit
	# @ npm run release
	# @ npm publish;
	# @ git push origin master;
