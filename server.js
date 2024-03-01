const GIT_PROVIDER = process.env.GIT_PROVIDER || "gitlab"
const PORT = process.env.PORT || 7877
const SCRIPTS_PATH = process.env.SCRIPTS_PATH || "./scripts"

const config = require('./config.json')
const runListener = require(`./listeners/${GIT_PROVIDER}`)

console.log(`[+] Starting Server on port ${PORT} ...`)

runListener(config, PORT, SCRIPTS_PATH)