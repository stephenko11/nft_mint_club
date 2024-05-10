/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_MORALIS_APPID: process.env.REACT_APP_MORALIS_APPID,
    REACT_APP_SERVERURL: process.env.REACT_APP_SERVERURL

  },
}

module.exports = nextConfig
