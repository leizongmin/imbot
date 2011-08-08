/**
 * bot.im API request
 *
 * @author leizongmin <leizongmin@gmail.com>
 * @version 0.1
 */
 
var request = exports;

var net = require('net');

/**
 * 生成POST数据
 * 仅由makeHttpRequestString调用
 * @param {object} post 数据
 * @return {string}
 */
request.makePostData = function (post) {
	var ret = '';
	for (i in post) {
		var k = i,
			v = post[i];
		var s = '------WebKitFormBoundaryeNufsASHM6ADtZXr\r\nContent-Disposition: form-data; name="' + k + '"\r\n\r\n' + v + '\r\n';
		ret += s;
	}
	ret += '------WebKitFormBoundaryeNufsASHM6ADtZXr--';
	return ret;
}

/**
 * 生成HTTP请求头
 * 仅由request.request调用
 * @param {string} token 身份认证字符串：base64(username:password)
 * @param {object} post API参数
 * @return {string}
 */
request.makeHttpRequestString = function (token, post) {
	var postData = new Buffer(request.makePostData(post));
	var ret =	'POST /api/bot/ HTTP/1.1\r\n' +
				'Host: www.imified.com\r\n' +
				'User-Agent: node-imbot\r\n' +
				'Authorization:	Basic ' + token + '\r\n' +
				'Content-Length: ' + postData.length + '\r\n' +
				'Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryeNufsASHM6ADtZXr\r\n' +
				'\r\n' +
				postData +
				'\r\n';
	//console.log(ret);
	console.log(postData.length);
	return ret;
}


/**
 * 发送HTTP请求
 * 仅由request调用
 * @param {string} requestData 请求字符串
 * @param {function} callback 回调函数
 */
request.httpRequest = function (requestData, callback) {
	
	var client = new net.Socket();
	var data = new Buffer('');
	
	// 发送HTTP请求
	client.on('connect', function () {
		client.end(requestData);
	});
	
	client.on('data', function (chunk) {
		data += chunk;
	});
	client.on('end', function () {
		var ret = data.toString().split(/\r\n\r\n/);
		if (ret.length > 1)
			callback(ret[1]);
		else
			callback('');
		delete client;
		delete data;
	});
	
	client.connect(80, 'www.imified.com');
}

/**
 * 发送API请求
 * @param {string} token
 * @param {object} params API参数
 * @param {function} callback
 */
request.request = function (token, params, callback) {
	request.httpRequest(request.makeHttpRequestString(token, params), callback);
}


/*
// 测试
request.request('dsdsdsdsds', {}, function (d) {
	console.log(d);
});
*/