const path = require('path');
const { exec } = require('./_utils');

if (!process.argv.includes('--skip-version')) {
	require('./bump-versions');
}

let rootPkgPath = path.resolve(__dirname, '..', 'package.json');
let rootPkg = require(rootPkgPath);

let pkgs = rootPkg.workspaces
	.filter(p => p !== 'example')
	.map(p => path.resolve(__dirname, '..', p))
	.map(p => ({ dir: p, name: require(path.join(p, 'package.json')).name }));

console.log(pkgs);

// First run prepublish scripts manually to ensure no errors for all packages
for (let { dir, name } of pkgs) {
	console.log('Running prepublish for %s', name);
	console.log(exec('npm run prepublishOnly', dir));
}

// Then publish for real
for (let { dir, name } of pkgs) {
	console.log('Publishing %s', name);
	console.log(exec('npm publish', dir));
}

console.log('All packages published');
