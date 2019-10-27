import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';

import config from './config.json';

console.log(`[+] Starting Server on port ${config.port} ...`);
// console.log('[+] Config is: ', config);

/*
! This Code is just for debug and testing purposes

const repo = config.repos["mcisback/nodedeployman"]
const directory='/var/www'
console.log('[+] Raw Cmd is: \"', repo.cmd, "\"")

var cmdFun = eval(repo.cmd)
const cmd = cmdFun({directory: directory})

console.log(`[+] Testing command: `, cmd)

try {
  var childProcess = exec(cmd);

  childProcess.stdout.on('data', function(data) {
    console.log('childProcess stdout: ', data); 
  });
} catch(err) {
  console.log('err: ', err)
} */

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
      const destpath = config.repos[repoName].destpath;
      
      console.log('[+] Received Webhook From Github');
      console.log('[++] For Repo ', repoName);

      if (isAllowed && isMaster && destpath) {
        try {
          // let cmd = `cd ${destpath} && /bin/chmod +x gitpull.sh && /bin/bash gitpull.sh`;
          var cmdFun = eval(repoCmd);
          const cmd = cmdFun({destpath: destpath});
          
          console.log('Executing Cmd: ', cmd);
	
          var childProcess = exec(cmd);

          // Logs childProcess Output
          childProcess.stdout.on('data', function(data) {
            console.log('childProcess stdout: ', data); 
          });
        } catch (error) {
          console.log('Executing Cmd Error: ', error);
        }
      }
    });
    res.end();
  })
  .listen(config.port);
