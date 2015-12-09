'use strict';

var addr = require('../server/addr');

describe('addr', function () {
  
  function parse(value, user, host, full) {
    it('should parse ' + value, function () {
      var parsed = addr.parse(value);
      expect(parsed).to.have.property('user', user);
      expect(parsed).to.have.property('host', host);
      expect(parsed).to.have.property('full', full || value);
    });
  }

  parse('user@host',
        'user', 'host');
  parse('user@host.com',
        'user', 'host.com');
  parse('first.last@hostname.org',
        'first.last', 'hostname.org');
  parse('first.last+tag@sub.hostname.org',
        'first.last+tag', 'sub.hostname.org');
  parse('nick+tag@hostname.ua',
        'nick+tag', 'hostname.ua');
});
