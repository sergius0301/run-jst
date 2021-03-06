'use strict';

const fs = require('fs');
const pify = require('pify');
const fse = require('fs-extra');

class AbstractConfig {
  /**
   * @param {string} file
   */
  constructor(file = null) {
    this._file = file;
  }
  
  /**
   * @returns {string}
   */
  get file() {
    return this._file;
  }
  
  /**
   * @param {string} file
   *
   * @returns {promise}
   */
  load(file = null) {
    const configFile = file || this.file;
    
    return fse.pathExists(configFile)
      .then(exists => {
        if (!exists) {
          return Promise.reject(new Error(
            `Missing config file ${ configFile }`
          ));
        }
        
        return pify(fs.readFile)(configFile)
          .then(rawConfig => this.decode(rawConfig));
      });
  }
  
  /**
   * @param {*} config
   * @param {string} file
   *
   * @returns {promise}
   */
  dump(config, file = null) {
    return this.encode(config)
      .then(rawConfig => pify(fs.writeFile)(file || this.file, rawConfig));
  }
  
  /**
   * @param {string} rawConfig
   *
   * @returns {promise}
   */
  decode(rawConfig) {
    return Promise.reject(new Error(`${ this.constructor.name }.decode(rawConfig) not implemented!`));
  }
  
  /**
   * @param {*} config
   *
   * @returns {promise}
   */
  encode(config) {
    return Promise.reject(new Error(`${ this.constructor.name }.encode(config) not implemented!`));
  }
}

module.exports = AbstractConfig;
