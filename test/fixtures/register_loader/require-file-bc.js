(function () {
  var path = require('path');

  require.extensions['.c'] = function (module, filepath) {
    module.loaded = true;
    module.exports = 'Load ' + path.basename(filepath) + ' by require-file-bc';
  };
})();
