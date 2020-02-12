const debug = require('debug')('lib:utils:getRequestInfo'); // eslint-disable-line no-unused-vars

module.exports = function getRequestInfo(req) {
  const requestInfo = {
    baseUrl: req.baseUrl,
    body: req.body,
    cookies: req.cookies,
    fresh: req.fresh,
    headers: req.headers,
    hostname: req.hostname,
    ip: req.ip,
    ips: req.ips,
    method: req.method,
    originalUrl: req.originalUrl,
    params: req.params,
    path: req.path,
    protocol: req.protocol,
    query: req.query,
    route: req.route,
    secure: req.secure,
    signedCookies: req.signedCookies,
    stale: req.stale,
    subdomains: req.subdomains,
    xhr: req.xhr
  };
  return requestInfo;
};
