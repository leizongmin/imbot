/**
 * IM Bot, use bot.im<http://bot.im> API
 *
 * @author leizongmin <leizongmin@gmail.com>
 * @version 0.1
 */

var http = require('http'),
	querystring = require('querystring'),
	botapi = require('./bot.im.api.js');
 
var imbot = exports;

/***********************************************************************************************/
/**
 * 默认机器人配置
 * 包括： port:'监听端口', authbasic:'登录bot.im的用户名:密码的Basic64值', botkey:'用于调用bot.im API'
 */
imbot.getDefaultConfig = function () {
	return {
		port:	88000,
		}
}

/**
 * 创建一个新机器人
 * @param {object} conf 配置
 * @return {}
 */
imbot.createBot = function (conf) {
	var botconf = imbot.getDefaultConfig();
	if (typeof conf != 'undefined') {
		for (i in conf)
			botconf[i] = conf[i];
	}
	return new bot(botconf);
}

/** 标准输入输出流 */
imbot._io = {
	stdin:	process.stdin,
	stdout:	process.stdout,
	stderr:	process.stderr
	}

/**
 * 输出日志信息
 * @param {object} msg
 */
imbot.log = function (msg) {
	imbot._io.stdout.write('[imbot] ' + msg + '\n');
}

/**
 * 输出错误信息
 * @param {object} msg
 */
imbot.error = function (msg) {
	imbot._io.stderr.write('[imbot] ERROR: ' + msg + '\n');
}

/***********************************************************************************************/
/**
 * 机器人
 * @param {object} conf 配置
 */
var bot = function (conf) {
	var self = this;
	self._config = conf;
	
	/* 配置botapi */
	botapi.config({
		authbasic: 	conf.authbasic,
		botkey:		conf.botkey
	});
	self.send = botapi.send;
	self.updateStatus = botapi.updateStatus;
	self.getUser = botapi.getUser;
	self.getAllUsers = botapi.getAllUsers;
	
	self._server = http.createServer(function (request, response) {
		// 获取POST数据
		var data = new Buffer('');
		request.on('data', function (chunk) {
			data += chunk;
		});
		request.on('end', function () {
			if (data == '') {
				response.end('Not enough params.');
				return;
			}
			
			var postData = querystring.parse(data.toString());
			// 触发"message"事件, 第一个参数为消息参数，第二个参数为一个函数，用于直接反馈消息
			self.onmessage(postData, function (msg) {
				response.end(msg);
			});
			
			imbot.log('Bot get message from [' + postData.user + ']');
		});
	});
	
	
	/** 默认的消息处理函数 */
	self.onmessage = function (msg, response) {
		response('You said: ' + msg + '\n' + ' reply: OK.');
	}
}

/**
 * 启动
 */
bot.prototype.run = function () {
	this._server.listen(this._config.port);
	imbot.log('Listen on port ' + this._config.port);
}

/**
 * 停止
 */
bot.prototype.close = function () {
	this._server.close();
	imbot.log('Server closed.');
}

/***********************************************************************************************/
process.on('uncaughtException', function (err) {
	imbot.error(err.stack);
});

