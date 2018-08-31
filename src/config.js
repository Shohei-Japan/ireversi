const dotenv = require('dotenv');

// 環境変数
// 環境が変わったら変わるもの
// PC・場所・ユーザーなど

switch (process.env.NODE_ENV) { // 読み込み先を変える
  case 'production':
    break;
  case 'test':
    dotenv.config({
      path: 'test.env',
    });
    break;
  default:
    dotenv.config();
}

module.exports = { //環境変数
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 10000,
  origin: process.env.URL_ORIGIN || 'http://localhost:10000',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/ireversi', 
};
