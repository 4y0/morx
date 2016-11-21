# MORX. A simple util for validation and parameter transformation

## How to use

### Install morx
`npm install morx`

### Basic Usage
```
var morx = require('morx');
var spec = morx.spec() //Begin spec-ing parameters
           .build('id', 'required:true, map:user_id')
           .build('username', 'required:true')
           .end(); //End parameter spec-ing

//Call validation
var validated = morx.validate({id:23, username:'demio9009'}, spec);
console.log(validated);
/*
{
    no_errors:true,
    error_messages:"",
    params:{
        'user_id':23,
        'username':'demio9009'
    },
    excluded_params:{},
    failed_params:[]
}
*/
```

### Using validators and filters
```
var morx = require('morx');
var spec = morx.spec() //Begin spec-ing parameters
           .build('id', 'required:true, validators:isInt, map:user_id')
           .build('username', 'required:true, validators:isAlphanumeric.isAscii, filters:toUpper')
           .end(); //End parameter spec-ing

//Call validation
var validated = morx.validate({id:23, username:'demio9009'}, spec);
console.log(validated);
/*
{
    no_errors:true,
    error_messages:"",
    params:{
        'user_id':23,
        'username':'DEMIO9009'
    },
    failed_params:[]
}
*/
```

### Spec-ing with morx
```
spec = {
    'paramTovalidate':ValidationExtractionAndTransformationRules
}
```
`paramToValidate` - The key / name of the parameter to apply the ObjectValidationRequirements to. E.g. `id` , `username` e.t.c. If you passing an array as your Parameter source, valid values for `paramToValidate` include 0,1 e.t.c.

`ValidationExtractionAndTransformationRules` - Key/value pair of a list of rules to use for validating, extracting and transforming `paramToValidate` as found in the parameter source. It has the following properties:

* `required` : (boolean `True` or `False`) indicates whether or not `paramToValidate` is required. Internally morx checks to see if `paramToValidate` is `undefined` or `""`
* `map` : If present, indicates the key `paramToValidate` should be returned with. Without `map`, `id` will be returned as `id`. With map (`map:user_id`), `id` will be returned as `user_id` (see example under basic usage)
* `validators`: A dot separated list of validators to apply to `paramToValidate`. Internally, morx uses the [validator](https://www.npmjs.com/package/validator) package on npm to validate parameter values. A list of supported validators can be found [here](https://www.npmjs.com/package/validator#validators). 
* `filters` : A dot separated list of filters / sanitizers to apply to `paramToValidate`. All filters with the exception of `toUpper` and `toLower` are the same as those provided by the validator package. A list can be found [here](https://www.npmjs.com/package/validator#sanitizers). 
* `not_param` : A boolean value indicated wether the `paramToValidate` should be returned as part of the extracted params. Useful for cases when a parm is required but not needed for functional operations. 

Parameter specs can be created either using object literals or morx's inbuilt spec-er:
```
var paramSpec = morx.spec() //Begin spec-ing parameters
    .build('id', 'required:true, map:user_id')
    .build('username', 'required:true')
    .end(); //End parameter spec-ing
/*
paramSpec is the same as the object literal:
{
    id:{
        required:true,
        map:'user_id'
    },
    username:{
        required:true,
    }
}
*/
```

### validating with morx

The morx validator takes three arguments, the first two are required.  
`var validated = morx.validate(ParameterSource, ParameterSpec, validationOptions)`

* `ParameterSource` - The object / array source to validate the ParameterSpec against i.e The parameters defined in the spec will be looked up in the parameter source. In a function, the `arguments` array-like object is a valid parameter source. In a web app / api, the req.body, req.params, req.query objects are all valid parameter sources. (When using `arguments`, an interesting usecase could be to use the `map` spec property to transform arguments passed to a function into an object)
* `ParameterSpec` - The spec definition with which to validate and extract values from the parameter source. See specing with morx for a more detailed explanation. The spec also precludes needless parameters from filtering into your apps. In cases of APIs / web projects where req.body / req.query could contain a number of properties, spec-ing ensures only what's needed by a function / service / endpoint is extracted
* `ValidationOptions` - The options that define the way morx handles validation success or faliure. By default, morx will not fail until all parameters defined in the spec requirements have been checked - even if one of the requirements of a spec is not met. It will return all failed params as well as error messages. With `ValidationOptions` we can fine-tune this behavior. There are three main properties:
    * `fail_on_first_error` - If this is set to true, morx will fail (i.e return to the calling function) at the first occurence of a validation error
    * `throw_error` - If this is set to true, instead of returning a well formed object, morx will throw an error with the validation error messages
    * `throw_error_on_first_fail` - Similar to `fail_on_first_error` but instead of returning, an error with the validation error message is thrown.

### Auto-test generation with [morx-cha](https://www.npmjs.com/package/morx-cha)

To use morx with [morx-cha](https://www.npmjs.com/package/morx-cha), the additional spec properties are required

* `eg` - Example value for the parameter
* `eg_specialcase` - Example special case value for the parameter, e.g. eg_invalid_email or eg_exists e.t.c. _This is yet to be implemented_

See example [here](https://github.com/4y0/morxcha/tree/master/examples)

