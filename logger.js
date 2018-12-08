'use strict';

// import modules
const SimpleNodeLogger = require('simple-node-logger');
const fs = require('fs');

const logFilePath = "./logs";

// create measurements folder if not exists
if (!fs.existsSync(logFilePath)) {
	fs.mkdirSync(logFilePath);
}

const options = {
	logDirectory: logFilePath,
	fileNamePattern: 'ftpLog_<DATE>.log',
	dateFormat: 'YYYY-MM-DD',
	timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
};

const e = module.exports = {};

e.log = SimpleNodeLogger.createRollingFileLogger(options);
