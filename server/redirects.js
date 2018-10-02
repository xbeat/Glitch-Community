module.exports = function(app) {
  redirect(app, '/partners*', '/teams');
  redirect(app, '/foryourapi*', '/teams');
  redirect(app, '/forteams*', '/teams');
}

function redirect(app, route, target) {
  app.get(route, (req, res) => {
     return res.redirect(301, target);
  });
}
