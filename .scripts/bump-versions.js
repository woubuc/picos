const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { exec } = require('./_utils');

let releaseType = 'patch';
if (process.argv.includes('minor')) releaseType = 'minor';
if (process.argv.includes('major')) releaseType = 'major';
console.log('Bumping all packages to next %s version', releaseType);

let isClean = !exec('git status --porcelain');
if (!isClean) {
	console.error('ERR: Git repository is not clean');
	process.exit(1);
}

let rootPkgPath = path.resolve(__dirname, '..', 'package.json');
let rootPkg = require(rootPkgPath);


let newVersion = semver.inc(rootPkg.version, releaseType);
console.log('New version: v%s', newVersion);

let pkgs = rootPkg.workspaces
	.map(dir => path.resolve(__dirname, '..', dir, 'package.json'))
	.map(p => ({ path: p, pkg: require(p) }));

for (let { path, pkg } of pkgs) {
	pkg.version = newVersion;
	fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
}

console.log('Updating root package.json');
rootPkg.version = newVersion;
fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2));

console.log('Creating git tag');
exec(`git tag -a "v${ newVersion }" -m "v${ newVersion }"`, path.resolve(__dirname, '..'));
exec('git add *', path.resolve(__dirname, '..'));
exec(`git commit -m "v${ newVersion }"`, path.resolve(__dirname, '..'));

console.log('All packages increased to v%s', newVersion);
