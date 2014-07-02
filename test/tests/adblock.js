'use strict';

var punycode = require('punycode');
var rewire = require('rewire');

var helper = require('../helper/testHelper');
var DummyResponse = require('../helper/dummyResponse');
var DummyRequest = require('../helper/dummyRequest');
var adblock = rewire('../../lib/plugins/adblock.js');
var config = require('config').test;

require('chai').should();

function testAdBlocked(url, expected) {
  var request = new DummyRequest(url);
  var response = new DummyResponse();

  adblock.handleRequest(request, response, null, function(cb, res) {
    res.should.equal(expected);
  });
}

module.exports = {
  'adblock': {
    before: function(done) {
      helper.setupLocalServer('test/helper/content/', function() {
        var adblockConfig =
        {
          adblock: {
            listUrl: helper.getLocalUrl('block-list'),
          }
        };

        adblock.__get__('log').logger
               .transports.console.level = config.logLevel;
        adblock.init(adblockConfig, done);
      });
    },

    after: helper.cleanAll,

    'fetchBlockList': {
      'fetch valid': function(done) {
        var list = {};
        var listFromFile = helper
                           .getFileContent('test/helper/content/block-list')
                           .split('\n');
        var fetchBlockList = adblock.__get__('fetchBlockList');
        fetchBlockList(helper.getLocalUrl('block-list'), list, function() {
          listFromFile.forEach(function(elt) {
            elt = punycode.toASCII(elt);
            if (elt !== '') {
              (elt in list).should.equal(true);
            }
          });
          done();
        });
      }
    },

    'blocked simple': function() {
      testAdBlocked('http://example.com', true);
    },

    'allowed simple': function() {
      testAdBlocked('http://mozilla.org', false);
    },

    'blocked accented': function() {
      testAdBlocked('http://accentéed.fr', true);
    },

    'blocked subdomain': function() {
      testAdBlocked('http://ad.example.com', true);
    },

    'allowed root domain': function() {
      testAdBlocked('http://test.org', false);
    },

    'allowed subdomain': function() {
      testAdBlocked('http://b.test.org', false);
    },

    'blocked subsubdomain': function() {
      testAdBlocked('http://c.a.b.test.org', true);
    },
  },
};