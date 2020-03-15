const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { spawnSync } = require('child_process');

let isClean = !spawnSync('git', ['status', '--porcelain']).stdout.toString().trim();
if (!isClean) {
	console.error('Git repository is not clean');
	process.exit(1);
}

let rootPkgPath = path.resolve(__dirname, '..', 'package.json');
const rootPkg = require(rootPkgPath);

let releaseType = 'patch';
if (process.argv.includes('minor')) releaseType = 'minor';
if (process.argv.includes('major')) releaseType = 'major';

let newVersion = semver.inc(rootPkg.version, releaseType);
console.log('Bumping all packages to v%s', newVersion);

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
console.log(spawnSync('git', ['tag', '-a', `v${ newVersion }`, '-m', `v${ newVersion }`], {
	cwd: path.resolve(__dirname, '..'),
}).stderr.toString());
