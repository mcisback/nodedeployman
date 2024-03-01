import http from 'http';
import crypto from 'crypto';
import { exec } from 'child_process';



export default function runListener(config, port, scriptsPath) {
  http
  .createServer((req, res) => {
  	 
	 console.log('[+] Received New Request: ', req)

    req.on('data', chunk => {
	 	
		console.log('[+] Received Data for Request: ', chunk)

      const signature = `sha1=${crypto
        .createHmac('sha1', config.secret)
        .update(chunk)
        .digest('hex')}`;
      const isAllowed = req.headers['x-hub-signature'] === signature;
      const body = JSON.parse(chunk);
      const isMaster = body?.ref === 'refs/heads/master';
      const repoName = body?.repository?.full_name;

      const repoConfig = config.repos[repoName]
      const repoScript = repoConfig.script;
      const destpath = repoConfig.destpath;
      
      console.log('[+] Received Webhook From Github')
      console.log('[++] For Repo: ', repoName)
      console.log('[++] isMaster: ', isMaster)
      console.log('[++] repoCmd: ', repoCmd)
      console.log('[++] destpath: ', destpath)

      if (isAllowed && isMaster && destpath) {
        try {
          console.log('[++] Executing Cmd: ', cmd);
	
          var childProcess = exec(`${scriptsPath}/${repoScript} ${destpath}`);

          childProcess.stdout.on('data', function(data) {
            console.log('[++] childProcess stdout: ', data); 
          });
        } catch (error) {
          console.log('[!!] Executing Cmd Error: ', error);
        }
      }
    });
    res.end();
  })
  .listen(port);
}


