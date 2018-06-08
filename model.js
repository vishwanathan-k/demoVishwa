var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  	userName: {
            type: String,
            required: true
        },
        email: { type: String},
        role: { type: String},
	    companyName: { type: String},
        password: { type: String},
		conformPassword: { type: String }
});

var orgNameSchema = new Schema({
  	orgName: {
            type: String,
            required: true
        },
        address: { type: String}
        });

var orgWithUserSchema = new Schema({
  	userId: {
            type: String,
            required: true
        },
        orgId: { type: String},
	    userRole: { type: String}
});



// the schema is useless so far
// we need to create a model using it
var user = mongoose.model('User', userSchema);
var organization = mongoose.model('Org', orgNameSchema);
var organizationWithUser = mongoose.model('orgWithUser', orgWithUserSchema);

// make this available to our users in our Node applications
module.exports.user = user;
module.exports.organization = organization;
module.exports.organizationWithUser = organizationWithUser;
