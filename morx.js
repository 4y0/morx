var specer    = require('./lib/morx.specer');
var extractor = require('./lib/morx.param.extractor'); 
var morx = {};

morx.spec     = specer.spec;
morx.validate  = extractor.paramExtract; 
module.exports = morx;