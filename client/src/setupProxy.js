// Have proxy error locally, not sure if this is necessary for deploying
const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(proxy("/api/**", {
    target: "http://localhost:3000",
    secure: false
  }));
};
