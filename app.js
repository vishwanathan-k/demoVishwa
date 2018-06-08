var mongoose = require('mongoose');
var model = require('./model.js');
var _ = require('underscore');
var express = require('express');
var app = express();
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, '/view'));
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));




mongoose.connect('mongodb://localhost/demoDB', function(err) {

    if (err) throw err;

	//Create User Obiect
   /*var organizationWithUserObject = new model.organizationWithUser({
	
		userId: 'vvvv',
		orgId: 'Kallai'
   });
	Save the document into User table.
	  organizationWithUserObject.save(function(err){
		if (err) throw err;
	  })*/

	
    console.log('Successfully connected');

app.get('/loginPage', function(req, res) {
		res.render('loginPage')
  });

app.post('/loginAuth', function(req, res) {
	model.user.find({}, function(err, dbUsers) {
            if (err) throw err;
            console.log(JSON.stringify(dbUsers));
		model.user.findOne({ email: req.body.email }, function (err, loginUser) {
            res.render('index', {
                values: dbUsers,
				loginUser: loginUser
				
            });
		  });
        });
});
	
// User login validation Methord	
	app.get('/emailValidation/:email', function(req, res) {
		model.user.findOne({ email: req.params.email }, function (err, dbUser) {
			res.json({ dbUser });
		});	
});
	
	
// Add Company page  render  Methord	
    app.get('/', function(req, res) {
	 model.user.find({}, function(err, dbUsers) {
            if (err) throw err;
            console.log(JSON.stringify(dbUsers));
            res.render('loginPage', {
                values: dbUsers
            });
        });

    });
	
// Add Company page  render  Methord	
	app.get('/addCompany/:userRole', function(req, res) {
		model.organization.find({}, function(err, dbOrganization) {
            if (err) throw err;
		res.render('addCompany', {
                values: dbOrganization,
			    userRole:req.params.userRole 
            });
		});
    });

// User data Delete  Methord	
	app.delete('/deleteUser/:id', function(req, res) {
		model.user.findByIdAndRemove(req.params.id, (err, dbUser) => {  
		});
	 });
	
// Company data Delete  Methord	
	app.delete('/deleteCompany/:id', function(req, res) {
		model.organization.findByIdAndRemove(req.params.id, (err, dbOrganization) => {  
		});
	 });

// User data View  for edit Popup Methord			
	app.put('/editUser/:id', function(req, res) {
		model.user.findById(req.params.id, (err, dbUser) => {  
			res.json({ dbUser });
		});
	});
// Company data View  for edit Popup Methord		
	app.put('/editCompany/:id', function(req, res) {
		model.organization.findById(req.params.id, (err, dbOrganization) => {  
			res.json({dbOrganization});
		});
	});
	
// Company data Add Methord		
 app.post('/saveCompany', function(req, res) {
        var body = _.pick(req.body, 'orgName', 'address')
		console.log("======================req.body.userRole===========================",req.body.userRole)
		var companyObject = new model.organization({
            orgName: body.orgName,
            address: body.address
	    });
	  companyObject.save(function(err) {
	        model.organization.find({}, function(err, dbOrganization) {
                res.render('addCompany', {
                    values: dbOrganization,
					userRole: req.body.userRole
                });
            });
        })
	});
	
// User With Organization user role table data insert Methord
	app.post('/addUser', function(req, res) {
        var body = _.pick(req.body, 'userName', 'email', 'role', 'companyName', 'password', 'conformPassword')
		var email = req.body.userRole;
		var userObject = new model.user({
            userName: body.userName,
            email: body.email,
			role: body.role,
			companyName : body.companyName,
			password: body.password,
			conformPassword: body.conformPassword
	    });
	   
	// Organization With User role table data insert 
		var organizationWithUserObject = new model.organizationWithUser({
		   		userId: userObject._id,
				orgId: body.companyName,
			    userRole: body.role
	   			});
				 organizationWithUserObject.save(function(err) {
				 });
	
		userObject.save(function(err) {
		    model.user.find({}, function(err, dbUser) {
				model.user.findOne({ email: email }, function (err, loginUser) {
				res.render('index', {
                    values: dbUser,
					loginUser:loginUser
                  });
				});
            });
        })
	});
	
// User With Organization user role table data Update Methord	
	app.post('/updateUser', function(req, res) {
        var body = _.pick(req.body, 'id','userName', 'email', 'role', 'companyName', 'password', 'conformPassword')
		var email = req.body.edUserRole;
		 var userObject = {
            userName: body.userName,
            email: body.email,
			role: body.role,
			companyName : body.companyName, 
			password: body.password,
			conformPassword: body.conformPassword
	    };
		model.user.findByIdAndUpdate(req.body.id,{ $set: userObject}, (err, dbUser) => {  
		model.user.find({}, function(err, dbUserData) {
				model.user.findOne({ email: email }, function (err, loginUser) {
			    res.render('index', {
                    values: dbUserData,
					loginUser:loginUser
				});
			  });
            });
		});
			
			
    });
	
// Company data Update Methord	
	app.post('/updateCompany', function(req, res) {
        var body = _.pick(req.body, 'id', 'orgName', 'address')
		console.log("======================req.body.userRole===========================",req.body.userRole)
		var companyObject = {
            orgName: body.orgName,
            address: body.address
	    };
		model.organization.findByIdAndUpdate(req.body.id,{ $set: companyObject}, (err, dbOrganization) => {  
		    model.organization.find({}, function(err, dbOrganization) {
                res.render('addCompany', {
                    values: dbOrganization,
					userRole: req.body.userRole
                });
            });
		  });
			
    });
	
	

app.listen(8000);
});
