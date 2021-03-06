var path = require('path');
var userUtils = require('../utils/userUtils.js');
var encounterUtils = require('../utils/encounterUtils.js');
var postUtils = require('../utils/postUtils.js');

module.exports = function (app, express) {
  app.use(express.static(path.join(__dirname, '../../client')));

  // user routing
  app.post('/api/user/signin', userUtils.signInUser);
  app.get('/api/user/signout', userUtils.signOutUser);
  app.post('/api/user/signup', userUtils.createUser);
  // route keeps a user signed in even if they navigate away from the page
  app.post('/api/user/getsignedinuser', userUtils.getSignedInUser);

  // encounter routing
  // retrieves the encounters for a user
  app.get('/api/user/encounters/:userName', userUtils.authenticationRequired, encounterUtils.showAllEncountersFromUser);
  // creates a new encounter
  app.post('/api/user/encounter', userUtils.authenticationRequired, encounterUtils.createEncounter);
  // retrieves the most recent encounters from the site for use on the homepage
  app.get('/api/recentencounters', encounterUtils.recentEncounters);
  // retrieves a single encounter
  app.post('/api/encounter', encounterUtils.retrieveEncounterById);

  //endpoints for getting and posting comments
  app.get('/api/posts/:encounterid', userUtils.authenticationRequired, postUtils.showAllPostsForEncounter);
  app.post('/api/posts/', userUtils.authenticationRequired, postUtils.createPost);
};


