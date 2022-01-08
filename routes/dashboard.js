express = require('express');
route = express.Router();
const {logout,correction,auth,crTest,getindex,getlive,getAllTests,getTest,getstdsub,getcrtest} =
  require('../controllers/dashboardcon');
route.use(auth);
route.get('/',getindex);
route.get('/live',getlive);
route.get('/alltests',getAllTests);
route.get('/alltests/:id',getTest);
route.get('/alltests/:id/:stdid',getstdsub);
route.post('/alltests/:id/:stdid',correction);
route.post('/alltests/:id',correction);
route.get('/crtest',getcrtest);
route.post('/crtest',crTest);
route.post('/logout',logout);
module.exports = route; 