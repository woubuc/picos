const { execSync } = require('child_process');

function exec(cmd, cwd) {
	return execSync(cmd, { cwd }).toString().trim();
}

module.exports = { exec };
