# imbot: an IM Bot modules for NodeJs, use bot.im API. #
For detailed information about this, please visit the bot.im API documents: http://bot.im/developers/api.
如果想获得详细的关于imbot的信息，请浏览bot.im官方API文档：http://bot.im/developers/api。

## Quick Start ##
```javascript
var imbot = require('imbot');

// 监听80端口
var waiter = imbot.createBot({
		port:	82,
		botkey:	'在bot.im中创建的机器人botkey',
		authbasic: 'eW91cmVtYWlsQG1haWwuY29tOnBhc3N3b3Jk' // new Buffer('username:password').toString('base64'); 用于HTTP认证
	});

// 监听消息，详见http://bot.im/developers/api#sendmessage
waiter.onmessage = function (msg, response) {
	response('*' + msg.name + '*:' + msg.msg);	// 直接回复消息，也可以用imbot.send来发送
}

// 启动机器人
waiter.run();

// 关闭机器人
waiter.close();
```

## 发送消息 ##
```javascript
waiter.send({
	userkey:	'816B6956-E7F5-4861-89FA372C62F7DB14', // userkey，可以通过imbot.getUser来获取，详见http://bot.im/developers/api#sendmessage
	msg:		'同志们辛苦啦'
	}, function (d) {
		console.log(d);
});
// 成功：{ stat: 'ok', success: 'sent' }
// 失败：{ stat: 'fail', error: 'Invalid UserKey' }
```

## 更新状态 ##
```javascript
waiter.updateStatus({network: 'Jabber', msg: 'ok'}, function (d) {
	console.log(d);
});
// 详见http://bot.im/developers/api#status
// 成功：{ stat: 'ok', success: 'updated' }
// 失败：{ stat: 'fail', error: 'The your bot is not activated on the network you specified.' }
```

## 取用户信息 ##
```javascript
waiter.getUser({userkey: '816B6956-E7F5-4861-89FA372C62F7DB14'}, function (d) {
	console.log(d);
});
// 详见http://bot.im/developers/api#getuser
// 成功：{ stat: 'ok', user: { status: '', ...} }
// 失败：{ stat: 'fail', error: 'Invalid UserKey' }
```

## 取所有用户信息 ##
```javascript
waiter.getAllUsers({}, function (d) {
	console.log(d);
});
//详见http://bot.im/developers/api#getallusers
// 成功：{ stat: 'ok', users: [user: { status: '', ...}, ..] }
```
