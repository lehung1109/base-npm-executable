import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { copy } from '../helpers/copy.js';
import os from 'os';

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

interface Props {
  appName: string;
  root: string;
}

const installTemplate = async (model: Props) => {
  const { appName, root } = model;
  console.log('\nInitializing project');
  const copySource = ['**'];

  await copy(copySource, root, {
    cwd: path.join(dirname, '..')
  });

  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

  packageJson.name = appName;
  packageJson.description = '';
  packageJson.version = '0.1.0';

  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  )

  console.log('\nInstalling dependencies:');
};

export { installTemplate }