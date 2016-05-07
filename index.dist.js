'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _makeRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ax, config) {
    var result, response;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = null;
            _context.prev = 1;
            _context.next = 4;
            return ax.request(config);

          case 4:
            response = _context.sent;

            result = response.data;
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](1);

            console.error('[GQLHTTP] Request failed with: ' + _context.t0.status + ' - ' + _context.t0.statusText);
            console.error('[GQLHTTP] Error: ' + (0, _stringify2.default)(_context.t0.data));

          case 12:
            return _context.abrupt('return', result);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 8]]);
  }));
  return function _makeRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _DEFAULT_AX_CONFIG = {
  url: '/gql',
  method: 'POST',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

function graphQLClient(host, config) {
  if (config === undefined) {
    config = _DEFAULT_AX_CONFIG;
  }
  config.baseURL = host;
  var ax = _axios2.default.create(config);

  return {
    query: function query(_query, variables) {
      return _makeRequest(ax, {
        data: {
          query: _query,
          variables: variables
        }
      });
    }
  };
}

exports.default = graphQLClient;
