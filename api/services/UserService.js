/**
  * UserService.js 
  *
  * @description :: Provides common user services
  * @docs        :: http://sailsjs.org/#!documentation/controllers
  */

module.exports = {

    getRequestUser: function (request, cbk) {
        //Expect that we already have a valid token at this point
        var googleId = request.cookies.googleId;
        var key = request.cookies.key;

        if (!googleId || !key)
            cbk(null);

        User.findOne({ id: googleId }, function (err, user) {
                        
            if (!err && user) {
                var dbKey = user.tokens.access_token.substring(0, 5);
                if(dbKey == key)
                    return cbk(user);
            }
            
            return cbk(null);
        });
    }
}