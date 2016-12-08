var expect = require('chai').expect;
var morx   = require('../morx');


describe('******-******MORX******-******', function () {


	//Basic usage
	it('Should validate test params succesfully', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail')
						.build('ukey', 'required:true,not_param:1')
						.build('email', 'required:false,validators:isEmail')
						.end();


		var test_params = {
			'id': 45,
			'username':'desujoe@gmail.com',
			'ukey':'9009'
		};

		var morx_result = morx.validate(test_params, paramSpec);
		console.log(morx_result);
		test_params = morx_result.params;
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.have.property('user_id').to.equal(45);
		expect(test_params).to.have.property('username').to.equal('desujoe@gmail.com');
		expect(morx_result).to.have.property('no_errors').to.equal(true);
	});



	it('Should validate test_params and transform DESUJOE@GMAIL.COM to lowercase', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail, filters:toLower')
						.end();

		var test_params = {
			'id':'45',
			'username':'DESUJOE@GMAIL.COM'
		};

		var morx_result = morx.validate(test_params, paramSpec);
		test_params = morx_result.params;
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.have.property('user_id').to.equal('45');
		expect(test_params).to.have.property('username').to.equal('desujoe@gmail.com');
	});



	it('Should fail with "id is required" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'idss':'45',
			'username':'desujoe@gmail.com'
		};

		var morx_result = morx.validate(test_params, paramSpec);
		test_params = morx_result.params;
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.not.have.property('user_id');
		expect(morx_result.error_messages).to.equal('id is required');
		expect(test_params).to.have.property('username').to.equal('desujoe@gmail.com');
	});



	it('Should fail with "4a5 failed isInt validation" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'id':'4a5',
			'username':'desujoe@gmail.com'
		};

		var morx_result = morx.validate(test_params, paramSpec);
		test_params = morx_result.params;
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.not.have.property('user_id');
		expect(morx_result.error_messages).to.equal('4a5 failed isInt validation');
		expect(test_params).to.have.property('username').to.equal('desujoe@gmail.com');
	});



	it('Should fail with "desujoe@@gmail.com failed isEmail validation" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'id':'45',
			'username':'desujoe@@gmail.com'
		};

		var morx_result = morx.validate(test_params, paramSpec); console.log(morx_result);
		test_params = morx_result.params; 
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.not.have.property('username');
		expect(morx_result.error_messages).to.equal('desujoe@@gmail.com failed isEmail validation');
	});



	it('Should throw "Validator isInnt not found" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInnt')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'id':'45',
			'username':'desujoe@@gmail.com'
		}; 
		function errorThrowTest(){
			morx.validate(test_params, paramSpec)
		}
		expect(errorThrowTest).to.throw("Validator isInnt not found"); 
	
	});



	it('Should throw "Filter Length45 not found" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail, filters:Length45')
						.end();

		var test_params = {
			'id':'45',
			'username':'desujoe@gmail.com'
		}; 
		function errorThrowTest(){
			(morx.validate(test_params, paramSpec))
		}
		expect(errorThrowTest).to.throw("Filter Length45 not found"); 
	
	});




	it('Should fail with "id is required , username is required" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'ids':'45',
			'usernames':'desujoe@@gmail.com'
		};

		var morx_result = morx.validate(test_params, paramSpec);
		test_params = morx_result.params; 
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.not.have.property('username');
		expect(morx_result.error_messages).to.equal('id is required , username is required');
	});


	it('Should fail with "id is required" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id, validators:isInt')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'ids':'45',
			'usernames':'desujoe@@gmail.com'
		};

		var morx_result = morx.validate(test_params, paramSpec, {fail_on_first_error:true});
		test_params = morx_result.params; 
		expect(test_params).to.not.have.property('id');
		expect(test_params).to.not.have.property('username');
		expect(morx_result.error_messages).to.equal('id is required');
	});



	it('Should throw "id is required , username is required" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'ids':'45',
			'usernames':'desujoe@gmail.com'
		}; 
		function errorThrowTest(){
			(morx.validate(test_params, paramSpec, {throw_error:true}))
		}
		expect(errorThrowTest).to.throw("id is required , username is required"); 
	
	});



	it('Should throw "id is required" error', function (){
		var paramSpec = morx.spec()
						.build('id', 'required:true, map:user_id')
						.build('username', 'required:true, validators:isEmail')
						.end();

		var test_params = {
			'ids':'45',
			'usernames':'desujoe@gmail.com'
		}; 
		function errorThrowTest(){
			(morx.validate(test_params, paramSpec, {throw_error_on_first_fail:true}))
		}
		expect(errorThrowTest).to.throw("id is required"); 
	
	});

});
