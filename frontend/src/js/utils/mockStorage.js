// Mixin for Jest tests that involve modules that
// interact with localStorage or sessionStorage

module.exports = function(storageType) {
  // storageType: 'sessionStorage' or 'localStorage'
  var mockStorage = (function() {
    var store = {};
    return {
      getItem: function(key) {
        return store[key];
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      clear: function() {
        store = {};
      }
    };
  })();
  Object.defineProperty(window, storageType, {
    value: mockStorage,
    writable: true
  });
};
