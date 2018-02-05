
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