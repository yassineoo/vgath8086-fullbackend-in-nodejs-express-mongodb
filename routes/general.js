express = require('express');
route = express.Router();
port = 3000; 
//route.use();
const {livecheak,gethome,getemulator,getsendtest,getlogin,login,sendtest} =
  require('../controllers/generalcon.js');
route.get('/',gethome);
route.post('/',livecheak);
route.get('/emulator',getemulator);
route.get('/sendtest',getsendtest);
route.get('/login',getlogin);
route.post('/login',login);
route.post('/sendtestpage',sendtest);
/*route.get('/alltests/:id/std',getstdsub);
route.get('/crtest',getcrtest);

route.get('/:id',getSingleTask);
route.patch('/:id',updateTask);
route.delete('/:id',deleteTask);
*/
module.exports = route; 