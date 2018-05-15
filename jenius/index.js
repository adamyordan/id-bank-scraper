const formatter = require('./formatter')
const scrapper = require('./scrapper')

async function getHistory(credential) {
  const rawData = await scrapper.scrap(credential)
  const data = await formatter.format(rawData)
  return data
}

module.exports = { getHistory }
