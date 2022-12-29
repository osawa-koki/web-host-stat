
const EnvInfo = require("./next.config.js");

const isProd = process.env.NODE_ENV === "production";

const Setting = {
  isProd,
  title: "Web-Host-Stat",
  basePath: EnvInfo.basePath,
  apiUri: isProd ? "/api" : "http://localhost:80/api",
  domainPattern: /^[\w\d\-\.]+\.[a-z]{2,4}$/,
  copyWaitTime: 1000,
};

export default Setting;
