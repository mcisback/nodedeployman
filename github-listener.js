import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';

import config from './config.json';

console.log(`[+] Starting Server on port ${config.port} ...`);
// console.log('[+] Config is: ', config);

http
  .createServer((req, res) => {
    req.on('data', chunk => {
      const signature = `sha1=${crypto
        .createHmac('sha1', config.secret)
        .update(chunk)
        .digest('hex')}`;
      const isAllowed = req.headers['x-hub-signature'] === signature;
      const body = JSON.parse(chunk);
      const isMaster = body?.ref === 'refs/heads/master';
      const repoName = body?.repository?.full_name;
      const repoCmd = config.repos[repoName].cmd;
      const directory = config.repos[repoName].path;
      
      console.log('[+] Received Webhook From Github');
      console.log('[++] For Repo ', repoName);

      if (isAllowed && isMaster && directory) {
        try {
          // let cmd = `cd ${directory} && /bin/chmod +x gitpull.sh && /bin/bash gitpull.sh`;
	        console.log('Executing Cmd: ', `${repoCmd}`);
	
          exec(`${repoCmd}`);
        } catch (error) {
          console.log('Executing Cmd Error: ', error);
        }
      }
    });
    res.end();
  })
  .listen(config.port);
