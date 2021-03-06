'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Teacher = mongoose.model('Teacher'),
	_ = require('lodash'),
	Section = mongoose.model('Section');

var nodemailer = require('nodemailer');
/**
 * Create a Teacher
 *
 *
 */




var transporter = nodemailer.createTransport({
	service: 'Mandrill',
	auth: {
		user: 'sharmin.sultana.dola@gmail.com',
		pass: 'jI43KyXI1DB5r7ShgakCaA'
	}
});


//var email = {address:'s@gmail.com'};
exports.sendMail= function(req,res)
{
	//console.log(req.body);
	//var sections = req.body.sections;
	//var course

	//var sections = Section.find();
	var subj = 'course schedule of ' + req.body.teacher;
	//var sections = req.body.sections;
	//console.log(sections);
	//var htmlview = '<h1>' + 'Course Schedule of ' + req.body.teacher+   '</h1>';
	//sections.forEach(function (section) {
	//	//if(section.teacher === req.body.teacher)
	//	htmlview = htmlview + '<br/>' + '<p>'+ 'course: '+ section.course + ', section: ' + section.name + ', day: '+section.day +', start: '+section.start+', end: '+section.end + '</p>';
	//	console.log('i am in..');
	//});
	//htmlview = '<b>' + htmlview + '</b>';


	var mailOptions = {
		from: 'Ulab Course BOT <techdecipher@gmail.com>', // sender address
		to: req.body.mail, // list of receivers
		subject: subj, // Subject line
		text: '', // plaintext body
		html: '<div>'+ ' Teacher: ' + req.body.teacher + ', Course: ' +req.body.course + ', Section: ' + req.body.section+ ', Day: ' + req.body.day+ ', Start: ' + req.body.start+ ', End: ' + req.body.end +'</div>' // html body
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			res.send({message:'failed'});
			console.log(error);
		}else{
			console.log( 'Message sent to: ' + req.body.mail);
			res.send({message:'success'});
		}
	});
};



exports.create = function(req, res) {
	var teacher = new Teacher(req.body);
	teacher.user = req.user;


	teacher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teacher);
		}
	});


};

/**
 * Show the current Teacher
 */
exports.read = function(req, res) {
	res.jsonp(req.teacher);
};







//var smtpTransport = nodemailer.createTransport("SMTP",{
//	service: "Gmail",
//	auth: {
//		user: "techdecipher@gmail.com",
//		pass: "as"
//	}
//});
/**
 * Update a Teacher
 */
exports.update = function(req, res) {
	var teacher = req.teacher ;

	teacher = _.extend(teacher , req.body);

	teacher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teacher);
		}
	});
};

/**
 * Delete an Teacher
 */
exports.delete = function(req, res) {
	var teacher = req.teacher ;
	teacher.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teacher);
		}
	});
};

/**
 * List of Teachers
 */
exports.list = function(req, res) {

	Teacher.find().sort('-created').populate('user', 'displayName').exec(function(err, teachers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teachers);
		}
	});
};

/**
 * Teacher middleware
 */
exports.teacherByID = function(req, res, next, id) { 
	Teacher.findById(id).populate('user', 'displayName').exec(function(err, teacher) {
		if (err) return next(err);
		if (! teacher) return next(new Error('Failed to load Teacher ' + id));
		req.teacher = teacher ;
		next();
	});
};



/**
 * Teacher authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.teacher.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
