module.exports = function(app) {
  redirect(app, '/partners*', '/teams');
  redirect(app, '/foryourapi*', '/teams');
  redirect(app, '/forteams*', '/teams');
  redirect(app, '/react-starter-kit*', '/featured/react-starter-kit');
  redirect(app, '/website-starter-kit*', '/featured/website-starter-kit');  
  redirect(app, '/you-got-this*', '/featured/you-got-this-zine');  
  redirect(app, '/you-got-this/2*', '/featured/you-got-this-zine-2');  
}

function redirect(app, route, target) {
  app.get(route, (req, res) => {
     return res.redirect(301, target);
  });
}
