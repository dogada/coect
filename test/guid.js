'use strict';

var guid = require('../server/guid');

describe('guid.parse', function () {
  
  function parse(value, user, host, path, full) {
    it('should parse ' + value, function () {
      var parsed = guid.parseSync(value);
      expect(parsed).to.have.property('user', user);
      expect(parsed).to.have.property('host', host);
      expect(parsed).to.have.property('path', path);
      expect(parsed).to.have.property('full', full || value);
    });
  }

  function fail(value) {
    it('should reject ' + value, function () {
      var parsed = guid.parseSync(value);
      expect(parsed).equals(null);
    });
  }

  parse('userid@host/path',
        'userid', 'host', 'path');
  parse('Bgh30dK@host.com/path',
        'Bgh30dK', 'host.com', 'path');
  parse('Bgh30dK@sub.host.ua/path/dir/subdir',
        'Bgh30dK', 'sub.host.ua', 'path/dir/subdir');
  parse('idG39K@sub.hostname.org/path/dir/file.json',
        'idG39K', 'sub.hostname.org', 'path/dir/file.json');
  parse('Bgh30dK@host-name2.com:81/path',
        'Bgh30dK', 'host-name2.com:81', 'path');
  parse('Bgh389dK@s-ub.host_name_2.com:8081/path/dir',
        'Bgh389dK', 's-ub.host_name_2.com:8081', 'path/dir');

  fail('first.last@hostname.org/path/dir/subdir',
        'first.last', 'hostname.org', 'path/dir/file.json');
  fail('first.last+tag@hostname.org/path/dir/file.json',
        'first.last+tag', 'sub.hostname.org', 'path/dir/file');
  fail('nick+tag@hostname.ua/0gfhKl/list/listid_1',
        'nick+tag', 'hostname.ua', '0gfhKl/list/listid_1');


});


describe('guid.make', function () {
  
  function ok(addr, path, full) {
    it('should make and parse back ' + full, function (done) {
      guid.make({addr: addr, path: path}, function(err, id) {
        expect(id).is.a('string');
        var parsed = guid.parseSync(id);
        expect(id).to.equal(full);
        expect(parsed).to.have.property('path', path);
        expect(parsed).to.have.property('addr', addr);
        expect(parsed).to.have.property('full', full);
        done();
      });
    });
  }

  function fail(addr, path) {
    it('should finish with error for addr=' + addr + ' path=' + path, function (done) {
      guid.make({addr: addr, path: path}, function(err, id) {
        expect(err).instanceof(Error);
        done();
      });
    });
  }

  ok('userid@host', 'fgH2','userid@host/fgH2');
  ok('userid@host.org', 'fgH2/list/my', 'userid@host.org/fgH2/list/my');
  fail(null, 'fgH2/list/my');
  fail(null, null);
  fail(null);
  fail();
  fail('', '');
  fail(null, '');
  fail('', null);
});
