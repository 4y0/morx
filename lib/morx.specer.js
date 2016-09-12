var mosc = require('mosc');

var morxSpecer = {};
morxSpecer.spec = function (context) {
	return new mosc({context});
}

module.exports = morxSpecer;