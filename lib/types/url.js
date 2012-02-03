var Url = require("url");

module.exports.loadType = function (mongoose) {
  var SchemaTypes = mongoose.SchemaTypes;

  function Url (path, options) {
    SchemaTypes.String.call(this, path, options);
    function validateUrl (val) {
      var urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return urlRegexp.test(val);
    }
    this.validate(validateUrl, 'url is invalid');
  }
  Url.prototype.__proto__ = SchemaTypes.String.prototype;
  Url.prototype.cast = function (val) {
    if (val) return module.exports.normalizeUrl(val);
    return '';
  };
  SchemaTypes.Url = Url;
  mongoose.Types.Url = String;
};

// See http://en.wikipedia.org/wiki/URL_normalization
module.exports.normalizeUrl = (function () {
  var reorderQuery = function (query) {
    var orderedKeys = [], name, i, len, key, querystr = [];
    for (name in query) {
      for (i = 0, len = orderedKeys.length; i < len; i++) {
        if (orderedKeys[i] >= name) break;
      }
      orderedKeys.splice(i, 0, name);
    }
    for (i = 0, len = orderedKeys.length; i < len; i++) {
      key = orderedKeys[i];
      querystr.push(key + "=" + query[key]);
    }
    return querystr.join("&");
  };

  return function (uri) {
    var parsedUrl = Url.parse(uri, true);
    return parsedUrl.href;
  };
})();