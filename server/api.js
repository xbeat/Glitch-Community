/// A locally cached minimal api wrapper

const axios = require("axios");
const cache = require("memory-cache");

const {API_URL} = require("./constants");

