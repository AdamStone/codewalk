jest.dontMock('../../utils/mockStorage');
var mockStorage = require('../../utils/mockStorage');
mockStorage('sessionStorage');

var ViewStoreMock = jest.genMockFromModule('../ViewStore.js');


ViewStoreMock.get.mockImplementation(get);

module.exports = ViewStoreMock;


function get() {
  return {
    file: null,
    checkedOut: 0,
    expanded: {}
  };
}
