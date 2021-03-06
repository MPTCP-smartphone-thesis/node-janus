'use strict';

exports.byteToKb = function(b) {
  return b / 1024;
};

exports.byteToMb = function(b) {
  return b / 1048576;
};

exports.byteToMb = function(b) {
  return b / 1048576;
};

exports.kbToByte = function(kb) {
  return kb * 1024;
};

exports.mbToByte = function(mb) {
  return mb * 1048576;
};

exports.forEach = function(obj, callback) {
  for (var id in obj) {
    if (obj.hasOwnProperty(id)) {
      callback(obj[id], id);
    }
  }
};
