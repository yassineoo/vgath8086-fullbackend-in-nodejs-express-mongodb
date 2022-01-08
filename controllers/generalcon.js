const { Test} = require('../db/testschema.js');
const {Std} = require('../db/studentschema.js');
const bcrypt = require('bcrypt');
const pass = '$2a$09$l2tXlSVAPDN0qTeO.JSt3e6bO6cFL4GBvtIhomydqZU8qnvRXXQbK'
gethome= (req,res)=> {
    console.log(req.url);
    res.render('logo',{checkmessage:req.flash('checkmessage')});
    
  }


getemulator=(req,res)=> {
    res.render('app');
    console.log(req.flash());
  }

getsendtest=(req,res)=> {
    res.render('home',{sendmessage:req.flash('sendmessage')});
    
  }
 
getlogin=(req,res)=> {

    res.render('adminlogin',{message:req.flash('logmessage')});
  }
login = async(req,res)=> {
  try {
    if (req.body.Username != "yassine")
    {
        req.flash('logmessage','no sush admin with this name')
        res.redirect('/login');
        return;
    }
   
        const rp = await bcrypt.compare(req.body.Password,pass)
        console.log(req.body.Password);
        console.log(typeof req.body.Password);
        console.log(rp);
        if (rp){
          req.session.logged = true
          req.session.username = "yassine";
          res.redirect('/dashboard');

        }
        else     {
          req.flash('logmessage','wrong password')
          res.redirect('/login');
      }
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
  
  
    }



livecheak = async(req,res)=> {
  try {
    info = req.body
    std = await Std.findOne({info});
    if (!std)
    {
        req.flash('checkmessage','wrong information please try again')
        res.redirect('/');
        return;
    }
    else {
        req.flash('checkmessage','you are registed as '+ info.familyName+" "+info.firstName )
          res.redirect('/');
      }
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
  
  
    }

sendtest = async (req,res)=>{
  try {
    console.log(typeof req.body.testid);
    test = await Test.findOne({testid:req.body.testid})
   if (!test)
   {
     req.flash('sendmessage','wrong test id');
    
     res.redirect('/sendtest')
   }
  else if (req.body.testPassword!=test.testPassword) {
      req.flash('sendmessage','wrong test password ');
      res.redirect('/sendtest')
  }
  else if ((Date.now()-test.startTime.getTime())>(test.time*60000)) {
    req.flash('sendmessage','time limit reached');
    res.redirect('/sendtest')

    }
  else {
    const {submission,familyName,firstName,group} = req.body;
    x=Date.now();
    y=test.startTime;
    const time = (x - y.getTime())/60000;
    std = {submission,familyName,firstName,group,time};
    if(test.testStudents) test.testStudents.push(std);
    else  test.testStudents =[std]
    test  = await Test.findOneAndUpdate({_id:test._id},{testStudents:test.testStudents},{
      new: true , runValidators:true
   });
   req.flash('sendmessage','the test has been sent succesfully');
   res.status(200).redirect('/sendtest')

  }
      
  } catch (error) {
     res.status(500).json(error);
  } 
   
}

    module.exports ={gethome,getemulator,getsendtest,getlogin,login,sendtest,livecheak} 
