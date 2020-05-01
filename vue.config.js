const fs = require('fs')

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8888,
    host: '0.0.0.0',
    public: '0.0.0.0:8888',
    disableHostCheck: true,
    https: {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    }
  }
}