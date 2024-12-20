import { test as ciTeardown, expect } from '@playwright/test';
import util from 'util';

const asyncExec = util.promisify(require('child_process').exec);

ciTeardown('stops docker container', async () => {
  try {
    const { stdout, stderr } = await asyncExec('docker stop wjt-e2e-latest');
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  } catch (error) {
    console.error(`exec error: ${error}`);
  }
});
