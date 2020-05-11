/**
 * Callback method for when solution is opened.
 * When deeplinking into solutions, the argument part of the deeplink url will be passed in as the first argument
 * All query parameters + the argument of the deeplink url will be passed in as the second argument
 * For more information on deeplinking, see the chapters on the different Clients in the Deployment Guide.
 *
 * @param {String} arg startup argument part of the deeplink url with which the Client was started
 * @param {Object<Array<String>>} queryParams all query parameters of the deeplink url with which the Client was started
 *
 * @properties={typeid:24,uuid:"C70C14D7-5482-49D8-85B9-EDEEFFA813F9"}
 */
function psl_login_onSolutionOpen(arg, queryParams) 
{
	globals.ma_sec_login_onSolutionOpen(arg, queryParams);
	scopes.psl.Setup();
}

/**
 * @AllowToRunInFind
 * 
 * Perform deep login with the token provided from webapp
 * @param various
 * @param arguments
 *
 * @properties={typeid:24,uuid:"4B1C8F71-1EC0-4013-8F7E-CE2FD2A67BA4"}
 */
function deepLoginFromApp(various,arguments)
{
    //http://localhost:8080/servoy-webclient/ss?s=PresenzaSempliceLite&m=deepLoginFromApp&a=args&token=token_hash
	
	if(!arguments)
		return false;

	// crypted token as passed from our source application
	/** @type {String} */
	var token = arguments['token']; 
	
	var options = scopes.crypto.createOptions().setAlgorithmName(scopes.crypto.ALGORITHM_NAMES.AES);
	options.setKey(scopes.crypto.createOptions().setAlgorithmName(scopes.crypto.ALGORITHM_NAMES.AES).getKeyAsString());
	var decryptedToken = scopes.crypto.decryptAsString(token,options);
	
	var arrToken = decryptedToken.split(':');
	
	var username = arrToken[0];
	var owner = arrToken[1];
	var organization = arrToken[2];
	var generationTime = arrToken[4];
	
	// control if token has expired (1 minutes default validity)
	var now = new Date();
	if(parseInt(generationTime,10) - now.getTime() >= 6000)
		return false;
	
	var _authObj = new Object();
	_authObj.username = username;
	_authObj.user_id = null;
	_authObj.owner = owner;
	_authObj.owner_id = null;
	_authObj.framework_db = 'svy_framework';
	_authObj.organization = organization;
	_authObj.organization_id = null;
	_authObj.user_org_id = null;
	
	// preparing search of (user,organization) couple's login
	var _user_org_id = -1;
		
	// get and set owner id
	_authObj.owner_id = globals.svy_sec_lgn_owner_id = globals.svy_sec_getOwnerFromName(_authObj.owner,_authObj.framework_db);
		
	// if username has been provided as param
	if(_authObj.username)
	{
		// get and set user id
		_authObj.user_id = globals.svy_sec_lgn_user_id = globals.svy_sec_getUserFromName(_authObj.username,_authObj.owner_id,_authObj.framework_db);
		// get and set organization id
		_authObj.organization_id = globals.svy_sec_lgn_organization_id = globals.svy_sec_getOrganizationFromOwnerOrganization(_authObj.owner_id,_authObj.organization,_authObj.framework_db);
	
		/** @type {JSFoundSet<db:/svy_framework/sec_user_org>} */
		var _fsUserOrg = databaseManager.getFoundSet(_authObj.framework_db, 'sec_user_org');
		_fsUserOrg.find();
		
		_fsUserOrg.user_id = _authObj.user_id;
		_fsUserOrg.organization_id = _authObj.organization_id;
	
		if (_fsUserOrg.search())
			_user_org_id = _fsUserOrg.user_org_id;
	}
	else
	{
		/** @type {JSFoundSet<db:/svy_framework/sec_owner_default_user>} */
		var _fsUserDef = databaseManager.getFoundSet(_authObj.framework_db, 'sec_owner_default_user');
		_fsUserDef.find();
		_fsUserDef.owner_id = _authObj.owner_id;
		if (_fsUserDef.search())
			_user_org_id = _fsUserDef.sec_user_org_id;
		
		// get and set user id
		_authObj.user_id = globals.svy_sec_lgn_user_id = globals.svy_sec_getUserFromUserOrgId(_authObj.user_org_id,_authObj.framework_db);
		
		// get and set corresponding username for login
		_authObj.username = globals.svy_sec_getUserName(_authObj.user_id,_authObj.owner_id,_authObj.framework_db);
		
		// get and set organization id
		_authObj.organization_id = globals.svy_sec_lgn_organization_id = globals.svy_sec_getOrganizationFromUserOrgId(_user_org_id,_authObj.framework_db);
	}
	
	// no cookies
	globals.svy_sec_cookies = false;
			
	if(_user_org_id == 0) 
		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = 0
	else if (_user_org_id > 0) 
		_authObj.user_org_id = globals.svy_sec_lgn_user_org_id = _user_org_id;
	else
	{
		application.output('Can\'t find user organization\'s id for user ' + username + ' of owner ' + owner,LOGGINGLEVEL.ERROR)
		return false;
	}
	
	// save cookies
	application.setUserProperty(application.getSolutionName() +'.username',_authObj.username);
	globals.svy_sec_lgn_organization_id = _authObj.organization_id;
	application.setUserProperty(application.getSolutionName() +'.ownername',_authObj.owner);
	application.setUserProperty(application.getSolutionName() +'.organization',_authObj.organization_id);
	application.setUserProperty(application.getSolutionName() +'.connected','true');
	
	//for keeping track of logged in users per owner
	application.addClientInfo(_authObj.owner_id + " " + _authObj.owner);
	
	return security.login(_authObj.username, _authObj.user_org_id, ['users']);
}