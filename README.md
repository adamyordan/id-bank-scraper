Indonesia Bank Scrapers
===
This node module contains the scraper for some Indonesian banks and e-payments. That's the plan at least. Currently only the following is supported:
- BPTN Jenius


Getting Started
===
Install package from npm:
```
npm install id-bank-scraper
```

Then you can simply import and use it in your node module:
```
const JeniusScraper = require('id-bank-scraper/jenius')

const credential = {
    email: you@mail.com,
    password: your_jenius_password
}

JeniusScraper.getHistory(credential).then(data => {
    console.log(data)
})
```


Command Line Interface
===
You can also use this module independently
```
git clone https://github.com/adamyordan/id-bank-scraper.git
cd id-bank-scraper
npm i
node index.js -b jenius -e <email> -p <password>
```
The output will be writtent o `output` directory.


Data Structure
===
The structure of resulting history data is as follows:
```
{
    id: string, // transaction id
    amount: int, // transaction amount
    note: string, // transcaction note
    debitCredit: string, // 'DEBIT' or 'CREDIT'
    createdAt: string, // 'ISO date string'
    partnerName: string, // recipient or sender name
    partnerAccount: string, // recipient or sender account
    partnerOrg: raw.partner.org, // recipient or sender organization
}
```

License
===
The MIT license
