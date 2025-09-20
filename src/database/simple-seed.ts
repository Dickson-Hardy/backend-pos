console.log('🚀 Simple seed starting...')

import * as dotenv from 'dotenv'
dotenv.config()

console.log('Environment loaded')

setTimeout(() => {
  console.log('Timer test works')
  process.exit(0)
}, 1000)