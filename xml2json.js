/**
 * xml2json
 *
 * @author leizongmin <leizongmin@gmail.com>
 * @version 0.1
 */

var xml = require('node-xml');

var resoult = {};
var currentElement = resoult;

function startElement(name, attrs) {
	var element = {
		name: name,
		attrs: attrs,
		childs: [],
		text: '',
		parent: currentElement
		}
	currentElement.childs.push(element);
	currentElement = element;
}

function text(data) {
	currentElement.text += data.trim();
}

function endElement(name) {
	childElement = currentElement;
	currentElement = currentElement.parent;
	delete childElement.parent;
}

module.exports = function (xmldata, callback) {

	var parser = new xml.SaxParser(function (cb) {
	
		cb.onStartElementNS(startElement);
		cb.onCharacters(text);
		cb.onEndElementNS(endElement);
		
		cb.onStartDocument(function () {
			resoult = currentElement = {
				name:	'root',
				attrs: [],
				childs: [],
				text: ''
			};
		});
		
		cb.onEndDocument(function () {
			callback(resoult);
		});
	});

	parser.parseString(xmldata);
}

