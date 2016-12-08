var validator = require('validator');

validator.toUpper = function (str) {
	return str.toUpperCase();
}

validator.toLower = function (str) {
	return str.toLowerCase();
}
var morxParamExtractor = {};

function validateParamValue(value, validators) {

	var no_errors = true;
	var message   = [];
	validators.forEach( function (v) {
		vFunc = validator[v];

		if(vFunc){
			
			if(!vFunc(value + '')){
				message.push(value + " failed " + v + " validation");
				no_errors = false;
				return;
			}
		}
		else
		{
			throwErrorWhen(true, 'Validator ' + v + ' not found');
		}

	});

	return {
			no_errors: no_errors,
			message: message.join(', ')
		}
}

function transformParamValue(value, filters) {

	filters.forEach( function (f) {

		filter = validator[f];
		if (filter)
		{
			value = filter(value + '');
		}
		else
		{
			throwErrorWhen(true, 'Filter ' + f + ' not found');
		}
	});

	return value;
}

function throwErrorWhen(error_flag, message) {
	if(!message) return;
	if(error_flag){
		throw new Error(message);
	}
}

morxParamExtractor.registerValidator = function (validator_name, validator_func) {
	//todo v2
}


morxParamExtractor.registerFilter = function (filter_name, filter_func) {
	//todo v2
}

//Todo v2 .. add multiple support for multiple param sources
morxParamExtractor.paramExtract = function (param_source, param_spec, options){
	param_source = param_source || {};
	param_spec   = param_spec   || {};
	options      = options      || {};

	var extracted_params = {};
	var error_messages   = [];
	var failed_params    = [];
	var not_param_values = {};

	var no_errors = true;

	for(var param in param_spec){

		if (param_spec.hasOwnProperty(param)) {

			var spec = param_spec[param];

			var filters    = spec.filters    ? spec.filters.split('.')    : [];
			var validators = spec.validators ? spec.validators.split('.') : []; 

			var param_value = param_source[param];

			if(spec.required == 'true' && (typeof param_value == 'undefined' || param_value === "")){
				no_errors = false;
				error_messages.push( param + ' is required' );
				failed_params.push(param);
				throwErrorWhen(options.throw_error_on_first_fail, error_messages.join(','));
				if(options.fail_on_first_error){
					break;
				}
			} 
			else
			{
				if(typeof param_value != 'undefined'){
					
					var validated = validateParamValue(param_value, validators);
					if(validated.no_errors)
					{

						param_value = transformParamValue(param_value, filters);
						//If value is not needed as an extracted param ignore it.
						if(!spec.not_param){
							if(!spec.map)
							{
								if(param_value)
								extracted_params[param] = param_value;
							}
							else
							{
								if(param_value)
								extracted_params[spec.map] = param_value; 
							}
						}
						else
						{
							if(param_value)
							not_param_values[param] = param_value;
						}
					}
					else
					{
						no_errors = false;
						error_messages.push(validated.message);
						failed_params.push(param);
						throwErrorWhen(options.throw_error_on_first_fail, validated.message);
						if(options.fail_on_first_error){
							break;
						}
					}

				}
				
				
			}

		}

	}

	throwErrorWhen(options.throw_error, error_messages.join(' , '));
	return {
		no_errors:no_errors,
		params:extracted_params,
		failed_params:failed_params,
		excluded_params:not_param_values,
		error_messages:error_messages.join(' , ')
	}

}

module.exports = morxParamExtractor;