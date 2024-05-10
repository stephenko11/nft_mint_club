// webpack.config.js
import dotenv from 'dotenv'
import { DefinePlugin } from 'webpack'

module.exports = {
  ...
  plugins: [
    new Dotenv()
  ]
  ...
};
