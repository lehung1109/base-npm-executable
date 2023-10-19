#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';
import chalk from 'chalk';
import Conf from 'conf';
import fetch from 'node-fetch';

let projectPath: string = '';
const program = new Command();
const { green, yellow, bold, cyan } = chalk;
const packageName = 'sne';

program.name(packageName)
  .description('a simple npm executable')
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${green('<project-directory>')} [options]`)
  .action(name => {
    projectPath = name
  })
  .allowUnknownOption()
  .parse(process.argv);

const parseVersion = (version): number => {
  return parseInt(version.replaceAll('.', ''));
}

const update = fetch(`https://registry.npmjs.org/${packageName}/latest`).then(res => res.json()).catch(() => null);

async function notifyUpdate(): Promise<void> {
  try {
    const data = await update as {version: string};

    if (data.version && parseVersion(data.version) !== parseVersion(packageJson.version)) {
      const updateMessage = `npm update ${packageName}`;

      console.log(
        yellow(bold(`A new version of '${packageName}' is available!`)) +
          '\n' +
          'You can update by running: ' +
          cyan(updateMessage) +
          '\n'
      )
    }

    process.exit();
  } catch {
    // ignore error
  }
}

const run = async () => {
  const conf = new Conf({ projectName: packageName });
}

run()
  .then(async () => {
    await notifyUpdate();
  })
  .catch(async (error) => {
    console.log(error);
    
    await notifyUpdate();

    process.exit(1);
  });

export {}
