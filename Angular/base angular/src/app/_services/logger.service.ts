import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LogLevel } from '../config/app-constants';
import { CONFIGCONSTANTS, LogMethods } from './../config/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  logWithDate = true;

  constructor() { }

  debug(...msgs: any[]) {
    this.writeToLog(msgs, LogLevel.Debug);
  }

  info(...msgs: any[]) {
    this.writeToLog(msgs, LogLevel.Info);
  }

  warn(...msgs: any[]) {
    this.writeToLog(msgs, LogLevel.Warn);
  }

  error(...msgs: any[]) {
    this.writeToLog(msgs, LogLevel.Error);
  }

  log(...msgs: any[]) {
    this.writeToLog(msgs, LogLevel.All);
  }

  clear() {
    console.clear();
  }

  private writeToLog(msgs: any[], level: LogLevel) {
    if (this.shouldLog(level)) {
      let value = "";

      // Build log string
      if (this.logWithDate) {
        value = new Date() + " - ";
      }

      value += "Type: " + LogLevel[level];
      value += " - Message: ";

      // Log the value
      console[LogMethods[level]](value, ...msgs);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if (environment.production === true) {
      return false;
    }
    if ((level >= CONFIGCONSTANTS.logLevel && level !== LogLevel.Off) || CONFIGCONSTANTS.logLevel === LogLevel.All) {
      ret = true;
    }
    return ret;
  }
}
