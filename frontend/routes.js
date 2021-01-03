const nextRoutes = require('next-routes');

const routes = nextRoutes()
  .add('/fundraisers/create', '/fundraisers/create')
  .add('/fundraisers/:address', '/fundraisers/display')
  .add('/fundraisers/:address/requests', '/fundraisers/requests/index')
  .add('/fundraisers/:address/requests/create', '/fundraisers/requests/create');

exports.Link = routes.Link;
exports.Router = routes.Router;
module.exports = routes;
