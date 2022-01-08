const {Test} = require('../db/testschema.js');
auth =(req,res,next)=>{
   console.log(req.session.logged);
   if(req.session.logged){
       next();
   }else{
       res.redirect('/login');
   }
}
getindex =(req,res)=> {
  
    res.render('index');
    
  }

getlive = (req,res)=> {
  
    res.render('live');
    
  }

getAllTests =async(req,res)=> { 
   try {
      
      alltests  = await Test.find({})
      res.render('alltests',{alltests});
   } catch (error) {
      console.log(error);
      res.status(500).send();

   } 
    
    
}
getTest = async (req,res)=> { 
    
   try {
      testid = req.params.id;
      test  = await Test.findOne({testid})
      console.log(test);
      console.log(typeof test);
     if (test) res.render('testsstudent',{test});
     else res.status(404).send("not found");
   } catch (error) {
      console.log(error);
      res.status(500).send();

   } 
    
}

getcrtest =  (req,res)=> { 
   
    res.render('crtest',{ message :req.flash('message')});
  
}


crTest = async (req,res)=>{
    try {
     if (await Test.findOne({testid:req.body.testid}))
     {
       req.flash('message','this test is already exists');
       console.log('this test is already exists');
       res.redirect('crtest')
     }
    else {
     test  = await Test.create(req.body);
     req.flash('message','test created succsefly');
     res.status(201).redirect('crtest')
    }
        
    } catch (error) {
       res.status(500).json(error,'something goes wrong please try again');
    } 
     
 }
 getstdsub = async(req,res)=> { 
   try {
      testid = req.params.id;
      
      std  = await Test.findOne({"testStudents._id": req.params.stdid});
      console.log("*********",std);
     
      let element;
     for (let index = 0; index < std.testStudents.length; index++) {
            element = std.testStudents[index];
        if (element._id == req.params.stdid)
           break;
        
     }
     console.log("+++++++++",element);
     if (std) res.render('submission',{element});
     else res.status(404).send("not found");
   } catch (error) {
      console.log(error);
      res.status(500).send();

   } 
    
}

correction = async(req,res)=> { 
   try {
      testid = req.params.id;
      
      std  = await Test.findOne({"testStudents._id": req.body.stdid});
      console.log("*****************");
      console.log(std);

      if (std){
      let element;
      let index;
     for ( index = 0; index < std.testStudents.length; index++) {
            element = std.testStudents[index];
        if (element._id == req.body.stdid)
           break;
        
     }
     element.note=req.body.note;
     std.testStudents[index]=element;
     console.log("---------------------------------------------")
      res.redirect('/dashboard/alltests/'+std._id);
      res.end();
   }
     else res.status(404).send("not found brr");
   } catch (error) {
      res.status(500).send();

   } 
    
}
logout = (req,res) =>{
   //req.logged=false;
   req.session.destroy();
   res.status(200).redirect('/login');
}


module.exports = {logout,correction,auth,crTest,getindex,getlive,getAllTests,getTest,getstdsub,getcrtest}