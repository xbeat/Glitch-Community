module.exports = function(app) {
  redirect(app, '/partners*', '/forteams');
  redirect(app, '/foryourapi*', '/forteams');
}

function redirect(app, route, target) {
  app.get(route, (req, res) => {
     return res.redirect(301, target);
  });
}
