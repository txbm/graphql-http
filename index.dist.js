'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _makeRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ax, config) {
    var result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = null;
            _context.prev = 1;
            _context.next = 4;
            return ax.post('/gql', config);

          case 4:
            response = _context.sent;

            if (response.status !== 200) {
              console.warn('[GQLHTTP] Request returned non-200 code...');
            }
            result = response.data;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);

            console.error('[GQLHTTP] Request failed with: ' + _context.t0.status + ' - ' + _context.t0.statusText);

          case 12:
            return _context.abrupt('return', result);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 9]]);
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
    query: function query(qry, vrb) {
      return _makeRequest(ax, {
        data: (0, _stringify2.default)({ qry: qry, vrb: vrb })
      });
    }
  };
}

exports.default = graphQLClient;
