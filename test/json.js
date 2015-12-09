'use strict';

var coect = require('../server/');

describe('coect.json', function () {
  
  it('should parse valid json data', function() {
    coect.json.parse('{\"id\": \"Test\"}', function(err, data) {
      expect(data).to.have.property('id', 'Test');
    });
  });

  it('should return SyntaxError for invalid json data', function() {
    coect.json.parse('{id: \"Test\"}', function(err, data) {
      expect(err).instanceof(SyntaxError);
    });
  });

  it('should stringify valid data', function() {
    coect.json.stringify({id: 'Test'}, function(err, data) {
      expect(err).equals(null);
      expect(data).equals('{\"id\":\"Test\"}');
    });
  });

  it('should not stringify invalid data', function() {
    coect.json.stringify({date: new Date()}, function(err, data) {
      expect(err).instanceof(Error);
    });
  });

});
