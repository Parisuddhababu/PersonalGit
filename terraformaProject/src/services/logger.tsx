// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { CONFIG_CONSTANTS, LogLevel, LogMethods } from '@config/constant';

const LoggerService = {
	logWithDate: true,

	_writeToLog: function (msgs: any[], level: LogLevel) {
		if (this._shouldLog(level)) {
			let value = '';

			// Build log string
			if (this.logWithDate) {
				value = new Date() + ' - ';
			}

			value += 'Type: ' + LogLevel[level];
			value += ' - Message: ';

			// Log the value

			console[LogMethods[level]](value, ...msgs);
		}
	},

	_shouldLog: function (level: LogLevel) {
		if (process.env.NODE_ENV === 'production') {
			return false;
		}
		if ((level >= CONFIG_CONSTANTS.logLevel && level !== LogLevel.Off) || CONFIG_CONSTANTS.logLevel === LogLevel.All) {
			return true;
		}
		return false;
	},

	debug: function (...msgs: any[]) {
		this._writeToLog(msgs, LogLevel.Debug);
	},

	info: function (...msgs: any[]) {
		this._writeToLog(msgs, LogLevel.Info);
	},

	warn: function (...msgs: any[]) {
		this._writeToLog(msgs, LogLevel.Warn);
	},

	error: function (...msgs: any[]) {
		this._writeToLog(msgs, LogLevel.Error);
	},

	log: function (...msgs: any[]) {
		this._writeToLog(msgs, LogLevel.All);
	},

	clear: function () {
		console.clear();
	},
};

export default LoggerService;
