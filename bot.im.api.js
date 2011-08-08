/**
 * call bot.im API
 *
 * @author leizongmin <leizongmin@gmail.com>
 * @version 0.1
 */
 
var botim = exports;

var apiRequest = require('./bot.im.api.request.js'),
	apiParser = require('./bot.im.api.parser.js');


var botimDefaultConfig = {};
/**
 * 初始化
 * @param {object} conf 默认配置，至少包含authbasic = base64(用户名:密码)
 */
botim.config = function (conf) {
	botimDefaultConfig = conf;
}


/**
 * 发送消息
 * @param {object} params API参数
 * @param {function} callback
 */
botim.send = function (params, callback) {
	params.apimethod = 'send';
	if (!params.botkey)
		params.botkey = botimDefaultConfig.botkey;
	apiRequest.request(botimDefaultConfig.authbasic, params, function (d) {
		if (d.trim().toLowerCase() == 'sorry, an error occurred')
			callback({error: 'Unknow error: #0'});
		apiParser.sendMessage(d, callback);
	});
}
botim.sendMessage = botim.send;

/**
 * 更新状态
 * @param {object} params API参数
 * @param {function} callback
 */
botim.updateStatus = function (params, callback) {
	params.apimethod = 'updateStatus';
	if (!params.botkey)
		params.botkey = botimDefaultConfig.botkey;
	apiRequest.request(botimDefaultConfig.authbasic, params, function (d) {
		if (d.trim().toLowerCase() == 'sorry, an error occurred')
			callback({error: 'Unknow error: #0'});
		apiParser.updateStatus(d, callback);
	});
}

/**
 * 取所有用户信息
 * @param {object} params API参数
 * @param {function} callback
 */
botim.getAllUsers = function (params, callback) {
	params.apimethod = 'getallusers';
	if (!params.botkey)
		params.botkey = botimDefaultConfig.botkey;
	apiRequest.request(botimDefaultConfig.authbasic, params, function (d) {
		if (d.trim().toLowerCase() == 'sorry, an error occurred')
			callback({error: 'Unknow error: #0'});
		apiParser.getAllUsers(d, callback);
	});
}

/**
 * 取指定用户信息
 * @param {object} params API参数
 * @param {function} callback
 */
botim.getUser = function (params, callback) {
	params.apimethod = 'getuser';
	if (!params.botkey)
		params.botkey = botimDefaultConfig.botkey;
	apiRequest.request(botimDefaultConfig.authbasic, params, function (d) {
		if (d.trim().toLowerCase() == 'sorry, an error occurred')
			callback({error: 'Unknow error: #0'});
		apiParser.getUser(d, callback);
	});
}
