import config from './config/config'

import app from './app'

app.listen(config.PORT, () => {
  console.info(`listening on ${config.PORT}`)
})
