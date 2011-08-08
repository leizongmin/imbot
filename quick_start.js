/**
 * 启动机器人
 */
 
var imbot = require('./imbot');

// 监听80端口
var waiter = imbot.createBot({
		port:	82,
		botkey:	'botkey',
		authbasic: 'base64'
	});
waiter.run();

// 监听消息
waiter.onmessage = function (msg, response) {
	response('*' + msg.name + '*:' + msg.msg);
}

console.log('Bot start!');
