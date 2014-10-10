/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oAuthInfo = google.oauth2('v2');
var oauth2Client = new OAuth2('1025360607686-op7gr177p6soullah69ptfmlafhjrbkf.apps.googleusercontent.com', '1JEDe94bPogNJ86wKwY6hQSY', 'http://www.lvh.me/api/auth/oauth2callback');
 
module.exports = {
	
	login: function(req, resp) {
		
		// generate a url that asks permissions for Google+ and Google Calendar scopes
		var scopes = [
		  'https://www.googleapis.com/auth/plus.me',
		  'https://www.googleapis.com/auth/youtube',
		  'https://www.googleapis.com/auth/userinfo.profile'
		];

		var url = oauth2Client.generateAuthUrl({
		  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
		  scope: scopes, // If you only need one scope you can pass it as string
		  approval_prompt: 'force'
		});
		
		resp.redirect(url);		
	},
	
	oauth2callback: function(req, resp) {
		var code = req.query.code;
		
		oauth2Client.getToken(code, function(err, tokens) {
		  // Now tokens contains an access_token and an optional refresh_token. Save them.
		  if(!err) {
			oauth2Client.setCredentials(tokens);
			
			oAuthInfo.userinfo.v2.me.get({auth: oauth2Client }, function(err, response) {
			
			    if(err)
				   return response.send('error: ' + err);
				   
				//Check if user exists, => update, otherwise create
				User.findOne({ id: response.id })
					.exec(function(err, user) {
					
					if(err)
						return response.send('error: ' + err);
					
					if(user) {
					}
					else {
						User.create({
							id: response.id,
							tokens: tokens,
							profile: response
						}, 
						function(err, newUser) {
								
								if(err)
									return response.send('error: ' + err);
							
								//Set cookie for ~30days
								resp.cookie('googleId', response.id, { maxAge: 1000 * 60 * 60 * 24 * 30 });
								resp.cookie('key', tokens.access_token.substring(0,5), { maxAge: 1000 * 60 * 60 * 24 * 30 });
								return resp.redirect('/');
						});
					}
				});
			});			
		  }
		});
	}	
};

