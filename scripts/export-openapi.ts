import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openApiSpec } from '../src/docs/swagger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../generated/openapi');

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'openapi.json'), `${JSON.stringify(openApiSpec, null, 2)}\n`, 'utf8');
