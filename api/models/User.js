/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
        id: { primaryKey: true, type: 'string' },
        tokens: 'json',
        profile: 'json',
        removeWatched: 'boolean',
        targetPlaylist: 'string',
        watchActive: 'boolean'
  }
};

