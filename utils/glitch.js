// a wrapper for making calls to the glitch api
// replaces application.api with something higher level
// eventually you should turn me into a real npm package
// 👀 https://docs.google.com/spreadsheets/d/1T9u-NscZ2RlMFqrf-lEJ7MvKw-ckIehyLOkyyNrrBHo/edit#gid=785764015

"use strict";

const axios = require('axios');

// const Glitch = new axios
// needs authorizationToken (const persistentToken = self.currentUser() && self.currentUser().persistentToken();)

function Glitch(authToken) {
  this.authToken = authToken
}

const glitch = {
  users: {
    byIds: (ids) => {
      ;
    }
  },
  user: (id) => {
    ;
  }

  
  
}

module.exports = glitch