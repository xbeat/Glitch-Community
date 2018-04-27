// 🚧🚧🚧 scaffolded

// a wrapper for making calls to the glitch api (currently unused cuz i can't figure out global application scoping)
// replaces application.api with something higher level
// interface is designed for both community and FC users
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

// needs authorizationToken (const persistentToken = self.currentUser() && self.currentUser().persistentToken();)
// call and construct with:
// const glitch = new Glitch(authToken)
// then simply call methods against it, everything returns a promise, with included catch

function Glitch(authToken) {
  this.authToken = authToken
  axios.create({  
    baseURL: API_URL,
    cancelToken: (source != null ? source.token : undefined),
    headers: {
      Authorization: authToken, // optional. If undefined, it'll fail only on calls where auth is required.
    },
  });
  
  // API Calls
  
  users: {
    // glitch.users.byIds(ids)
    byIds: (ids) => {
      console.log('glitch.users.byIds(ids)')
      // returns promise
      // catch here
    }
  }
  
  // glitch.user.id(id)
  user: (id) => {
    console.log('glitch.user.id(id)')
    // returns promise
    // catch here
  }

}


module.exports = Glitch
