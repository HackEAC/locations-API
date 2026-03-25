import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const gitDir = path.join(repoRoot, '.git');

if (!existsSync(gitDir)) {
  process.exit(0);
}

execFileSync('git', ['config', 'core.hooksPath', '.githooks'], {
  cwd: repoRoot,
  stdio: 'inherit',
});

console.log('Configured git hooks path to .githooks');
