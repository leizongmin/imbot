/**
 * Parse bot.im API resoult
 *
 * @author leizongmin <leizongmin@gmail.com>
 * @version 0.1
 */
 
var xml2json = require('./xml2json.js');

var parser = exports;

/** 取得指定属性值 */
var getAttr = function (attrs, name) {
	for (i in attrs) {
		var attr = attrs[i];
		if (attr[0] == name) {
			return attr[1];
		}
	}
	return '';
}

/** 取得指定子节点 */
var getChilds = function (childs, name) {
	var ret = [];
	for (i in childs) {
		var child = childs[i];
		if (child.name == name) {
			ret.push(child);
		}
	}
	return ret;
}

/** 检查是否有rsp节点，以及其stat属性 */
var parseHeader = function (data, callback) {
	if (data.childs.length < 1) {
		callback({error: 'Unknow error: #1'});
		return;
	}
	var data = data.childs[0];
	if (data.name != 'rsp') {
		callback({error: 'Unknow error: #2'});
		return;
	}
		
	var resoult = {};
	resoult.stat = getAttr(data.attrs, 'stat') == 'ok' ? 'ok' : 'fail';
	callback(resoult, data);
}

/** 解析err节点 */
var parseErr = function (resoult, data, callback) {
	var error = getChilds(data.childs, 'err');
	if (error.length < 1) {
		resoult.error = 'Unknow error: #4';
	}
	else {
		resoult.error = getAttr(error[0].attrs, 'msg');
	}
	callback(resoult);
}

/** 解析user节点 */
var parseUser = function (user) {
	var ret = {};
	for (i in user.childs) {
		var attr = user.childs[i];
		ret[attr.name] = attr.text;
	}
	return ret;
}

/**
 * 解析SendMessage的结果
 * @param {string} xmldata XML数据
 * @param {function} callback
 */
parser.sendMessage = function (xmldata, callback) {
	xml2json(xmldata, function (data) {
		parseHeader(data, function (resoult, data) {
			if (resoult.error) {
				callback(resoult);
				return;
			}
		
			if (resoult.stat == 'ok') {
				var success = getChilds(data.childs, 'success');
				if (success.length < 1) {
					resoult.error = 'Unknow error: #3';
				}
				else {
					resoult.success = getAttr(success[0].attrs, 'msg');
				}
				callback(resoult);
			}
			else {
				parseErr(resoult, data, callback);
			}
		});
	});
}

/**
 * 解析UpdateStatus的结果
 * @param {string} xmldata XML数据
 * @param {function} callback
 */
parser.updateStatus = parser.sendMessage;

/**
 * 解析GetUser的结果
 * @param {string} xmldata XML数据
 * @param {function} callback
 */
parser.getUser = function (xmldata, callback) {
	xml2json(xmldata, function (data) {
		parseHeader(data, function (resoult, data) {
			if (resoult.error) {
				callback(resoult);
				return;
			}
			
			if (resoult.stat == 'ok') {
				var user = getChilds(data.childs, 'user');
				if (user.length < 1) {
					resoult.error = 'Unknow error: #5';
				}
				else {
					resoult.user = parseUser(user[0]);
				}
				callback(resoult);
			}
			else {
				parseErr(resoult, data, callback);
			}
		});
	});
}

/**
 * 解析GetAllUsers的结果
 * @param {string} xmldata XML数据
 * @param {function} callback
 */
parser.getAllUsers = function (xmldata, callback) {
	xml2json(xmldata, function (data) {
		parseHeader(data, function (resoult, data) {
			if (resoult.error) {
				callback(resoult);
				return;
			}
			
			if (resoult.stat == 'ok') {
				var users = getChilds(data.childs, 'users');
				if (users.length < 1) {
					resoult.error = 'Unknow error: #6';
				}
				else {
					users = getChilds(users[0].childs, 'user');
					if (users.length < 1) {
						resoult.error = 'Unknow error: #7';
					}
					else {
						resoult.users = [];
						for (i in users) {
							resoult.users.push(parseUser(users[i]));
						}
					}
				}
				callback(resoult);
			}
			else {
				parseErr(resoult, data, callback);
			}
		});
	});
}



/*
// 测试
parser.getAllUsers('test/getalluser.xml', function (data) {
	console.log(data);
});
*/