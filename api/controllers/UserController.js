/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2('1025360607686-op7gr177p6soullah69ptfmlafhjrbkf.apps.googleusercontent.com', '1JEDe94bPogNJ86wKwY6hQSY', 'http://www.lvh.me/api/auth/oauth2callback');

module.exports = {
    
    getPlaylists: function (req, resp) {
        UserService.getRequestUser(req, function (user) {

            if (!user)
                return resp.send(401);

            //Set auth credentials & create api wrapper
            oauth2Client.setCredentials(user.tokens);
            var youtube = google.youtube({ version: 'v3', auth: oauth2Client });

            //Do the request
            var items = [];
            
            sails.controllers.user.loadAllItems(items, function (token, cbk) {
                var params = { part: 'snippet', mine: true, maxResults: 50 };

                if(token)
                    params.pageToken = token;

                youtube.playlists.list(params, cbk);

            }, function(err) {
                
                if (!err && items) {
                    return resp.send(items);
                }

                resp.send(500, err);
            });
        });
    },
    
    loadAllItems: function(items, loadCbk, finishCbk) {

        var handler = function(err, data) {
            if(err || !data) {
                return finishCbk(err);
            }

            //Store this calls' items
            items.push.apply(items, data.items);

            //Next round
            if (data.nextPageToken)
                loadCbk(data.nextPageToken, handler);
            else
                finishCbk(null);
        }

        //First run
        loadCbk(null, handler);
    },

    getChannelInfo: function (req, resp) {
        UserService.getRequestUser(req, function (user) {

            if (!user)
                return resp.send(401);
            
            //Set auth credentials & create api wrapper
            oauth2Client.setCredentials(user.tokens);
            var youtube = google.youtube({ version: 'v3', auth: oauth2Client });

            //Do the request
            youtube.channels.list({ part: 'contentDetails', mine: true }, function (err, data) {

                if (!err && data) {
                    return resp.send(data.items[0].contentDetails);
                }

                resp.send(500, err);
            });

        });
    },

    getSubscriptions: function (req, resp) {
        UserService.getRequestUser(req, function (user) {

            if (!user)
                return resp.send(401);

            //Set auth credentials & create api wrapper
            oauth2Client.setCredentials(user.tokens);
            var youtube = google.youtube({ version: 'v3', auth: oauth2Client });

            //Do the request, collect all pages
            var items = [];
            sails.controllers.user.loadAllItems(items, function (token, cbk) {
                var params = { part: 'snippet', mine: true, maxResults: 50, order: 'alphabetical' };

                if (token)
                    params.pageToken = token;

                youtube.subscriptions.list(params, cbk);

            }, function (err) {

                if (!err && items) {
                    return resp.send(items);
                }

                resp.send(500, err);
            });
        });
    }

};

