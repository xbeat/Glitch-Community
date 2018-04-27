// a wrapper for making calls to the glitch api
// replaces application.api with something higher level
// eventually you should turn me into a real npm package
// 👀 https://docs.google.com/spreadsheets/d/1T9u-NscZ2RlMFqrf-lEJ7MvKw-ckIehyLOkyyNrrBHo/edit#gid=785764015

"use strict";

const axios = require('axios');
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

let API_URL;

if (process.env.RUNNING_ON === 'staging') {
  API_URL = 'https://api.staging.glitch.com/';
} else {
  API_URL = 'https://api.glitch.com/';
}

// const Glitch = new axios
// needs authorizationToken (const persistentToken = self.currentUser() && self.currentUser().persistentToken();)

function Glitch(authToken) {
  this.authToken = authToken
  axios.create({  
    baseURL: API_URL,
    cancelToken: (source != null ? source.token : undefined),
    headers: {
      Authorization: authToken,
    },
  });

}

// ^ construct w glitch = new Glitch(authToken)

const glitch = {
  // glitch.users.byIds(ids)
  users: {
    byIds: (ids) => {
      ;
    }
  },
  // glitch.user.id(id)
  user: (id) => {
    ;
  }

  
  
}

module.exports = Glitch