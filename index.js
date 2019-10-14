require('dotenv').config()
const writeJsonFile = require('write-json-file')
const makeDir = require('make-dir')
const argv = require('minimist')(process.argv.slice(2))
const jenius = require('./jenius')

// constant
const availableBank = ['jenius']

// helper
function coalesce(arr, cb) {
  for (let e in arr) { if (arr[e] != null) return arr[e] }
  if (cb != null) return cb()
  return null
}

// main
async function main() {
  const history = {}

  // parse arguments
  const bankId = argv.b
  const outputDir = argv.o || 'output'  

  // process
  if (bankId == 'jenius') {
    const email = coalesce([process.env.JENIUS_EMAIL, argv.e], () => {
      throw 'Email not set. Try adding -e argument' })
    const password = coalesce([process.env.JENIUS_PASSWORD, argv.p], () => {
      throw 'Password not set. Try adding -p argument' })
    console.log(email, password)
    history['jenius'] = await jenius.getHistory({ email, password })
  } else {
    throw 'Bank not supported. Try adding -b argument. Available bank: ' + availableBank
  }
  
  // write
  if (outputDir != null) {
    for (let bankId of Object.keys(history)) {
      const dirPath = __dirname + '/output/' + bankId + '/'
      const filePath = dirPath + 'history.json'
      await makeDir(dirPath)
      await writeJsonFile(filePath, history[bankId])
      console.log('[+] written ' + filePath)
    }
  }
}

// run
main().catch(err => { console.log(`[-] ${err}`); process.exit(1); })
