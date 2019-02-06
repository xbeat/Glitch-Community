const express = require("express");
const app = express();

app.get('/storybook', function(req, res) {
  res.send("Hello world from StoryBook")
});

// Listen on App port
app.listen(9001, () => {
  console.log(`Storybook is listening on port 9001.`);
});
