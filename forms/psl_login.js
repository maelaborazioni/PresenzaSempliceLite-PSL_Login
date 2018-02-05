/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"44230647-8B81-465B-89B9-C7CF3BA2245D"}
 */
var footer = globals.from_i18n('i18n:ma.psl.lbl.login.footer', [scopes.psl.SupportEmail]);

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AFB4FF7B-C75A-4752-9168-A693AAA5A0E6"}
 */
var html = '';


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C33987D8-347E-489E-8D1E-E5A48B79C681"}
 */
function onAction$lbl_logo(event) 
{
	application.showURL('http://www.hexelia.it');
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DDDB1DC2-ED59-4891-AB23-2B769047E35D"}
 */
function onLoad(event) 
{
	_super.onLoad(event);
	
	elements.allnames.filter (function(name){ return globals.startsWith('fld_', name); })
					 .forEach(function(name){ plugins.WebClientUtils.setExtraCssClass(elements[name], 'nofocus'); });
	
	plugins.WebClientUtils.setExtraCssClass(elements.btn_recupera_password, 'fade-on-hover');
	
	setHtml();
	showMessage("Inserisci i dati per l'accesso");
}

/**
 * @properties={typeid:24,uuid:"8F9CB879-5007-494E-AE4A-F14E4115A7AA"}
 */
function isOwnerEnabled()
{
	return globals.ma_utl_getSoftware(globals.Module.RILEVAZIONE_PRESENZE) == globals.ModuleSoftware.PRESENZA_SEMPLICE_LITE;
}

/**
 * @properties={typeid:24,uuid:"95530D18-6B31-43A9-97CA-E80C94EC8C1E"}
 */
function setHtml()
{
	var error_id  = '#' + plugins.WebClientUtils.getElementMarkupId(elements.error); 
	
	html = scopes.string.Format('<script type="text/javascript">\
									function hideMessage()\
									{\
										$("@0").slideUp(500);\
									}\
									\
									function showMessage(msg)\
									{\
										if($("@0").is(":visible"))\
											$("@0 span").text(msg);\
										else\
										{\
											setTimeout(function()\
											{\
												$("@0 span").text(msg);\
											},\
											1000);\
											\
											$("@0").hide().delay(500).slideDown(500);\
										}\
									}\
								</script>', 
								error_id);
}

/**
 * @param message
 *
 * @properties={typeid:24,uuid:"5D881EB4-F312-42A9-8B7B-3361E3548417"}
 */
function showMessage(message)
{
	plugins.WebClientUtils.executeClientSideJS(scopes.string.Format('showMessage("@0");', message));
}

/**
 * @properties={typeid:24,uuid:"8DC49F23-FF28-4088-A3C8-1F2AC2D1173D"}
 */
function hideMessage()
{
	plugins.WebClientUtils.executeClientSideJS('hideMessage();');
}