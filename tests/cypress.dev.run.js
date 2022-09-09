const cypress = require('cypress')
const tesults = require('cypress-tesults-reporter');

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjZjNDNiNTA4LTA5YTItNGEyZC1hM2YxLTY2ZGE3N2U0Mjg0Yi0xNjYyNjgwMTE4MzI2IiwiZXhwIjo0MTAyNDQ0ODAwMDAwLCJ2ZXIiOiIwIiwic2VzIjoiODQwODRkYjQtMDczYS00Mjg2LWEwNmItYTExN2ZhYTI1Y2NhIiwidHlwZSI6InQifQ.1vbzTPcn66lyZwKBNI0sKzZrCbCKlxugohMr0A50CDs'

cypress.run({
  browser: 'chrome',
  baseUrl: 'http://localhost:3000',
  env: {
    apiUrl: 'http://localhost:3333'
  }
})
.then((results) => {
  const args = {
    target: TOKEN,
  }
  tesults.results(results, args);
})
.catch((err) => {
 console.error(err)
})