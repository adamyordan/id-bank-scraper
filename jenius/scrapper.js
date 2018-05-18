const puppeteer = require('puppeteer')
const writeJsonFile = require('write-json-file')
const makeDir = require('make-dir');

let currentHistoryData = {}

function getHistoryData() {
  return currentHistoryData
}

async function scrap({ email, password }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  console.log('[+] Opening https://2secure.jenius.co.id/')
  await page.goto('https://2secure.jenius.co.id/')

  const INPUT_EMAIL_SELECTOR = 'input[name=email]'
  const INPUT_PASSWORD_SELECTOR = 'input[name=password]'
  const BUTTON_SUBMIT_SELECTOR = 'div[aria-label=Next_Button]'

  await page.waitForSelector(INPUT_EMAIL_SELECTOR)
  console.log('[+] Loaded https://2secure.jenius.co.id/')

  console.log('[+] Filling login form')
  await page.click(INPUT_EMAIL_SELECTOR)
  await page.keyboard.type(email)

  await page.click(INPUT_PASSWORD_SELECTOR)
  await page.keyboard.type(password)

  await page.click(BUTTON_SUBMIT_SELECTOR)
  console.log('[+] Submitting login form')

  await page.waitForNavigation()
  console.log('[+] Loaded dashboard')

  console.log('[+] Setting request interception')
  await page.setRequestInterception(true);
  page.on('request', async (interceptedRequest) => {
    try {
      const data = interceptedRequest.postData()
      if (data == null) {
        interceptedRequest.continue()
        return
      }
      const dataJson = JSON.parse(data)
      if (dataJson.operationName != 'inOutHistoryQuery') {
        interceptedRequest.continue()
        return
      }
      dataJson.variables.limit = 100

      console.log('[+] Intercepting history request')
      interceptedRequest.continue({ postData: JSON.stringify(dataJson )})
        
    } catch (error) {
      interceptedRequest.continue()      
    }
  })
  page.on('response', async (response) => {
    try {
      if (JSON.parse(response.request().postData()).operationName == 'inOutHistoryQuery') {
        const data = await response.json()
        console.log(data)
        currentHistoryData = data
        console.log('[+] Captured history data. Mission accomplished')
      }
    } catch (error) {
    }
  })

  console.log('[+] Opening history page')
  await page.goto('https://2secure.jenius.co.id/#/inout/inout')
  console.log('[+] Wait for few seconds...')
  await page.waitFor(10 * 1000)
  console.log('[+] Loaded history page')

  if (getHistoryData() == null) {
    throw "Jenius scrapper failed"
  }

  console.log('[+] Taking a cheese...')
  const t = new Date().getTime()
  await makeDir(__dirname + '/output')
  await page.screenshot({ path: __dirname + '/output/screenshot.' + t + '.png' })
  await writeJsonFile(__dirname + '/output/history.' + t + '.json', getHistoryData())
  await writeJsonFile(__dirname + '/output/history.json', getHistoryData())

  console.log('[+] Closing browser')
  await browser.close()
  console.log('[+] Bye')
  return getHistoryData()
}

module.exports = { scrap }
