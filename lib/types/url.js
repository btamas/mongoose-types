var Url = require("url");

module.exports.loadType = function (mongoose) {
  var SchemaTypes = mongoose.SchemaTypes;

  function Url (path, options) {
    SchemaTypes.String.call(this, path, options);
    function validateUrl (val) {
      if (!val) return true;
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

module.exports.normalizeUrl = (function () {
  return function (uri) {
    var parsedUrl = Url.parse(uri, true);
    return parsedUrl.href;
  };
})();