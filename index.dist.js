'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise2 = require('babel-runtime/core-js/promise');

var _promise3 = _interopRequireDefault(_promise2);

var _makeRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ax, config) {
    var result, response, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, err;

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
            _context.next = 34;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](1);

            console.error('[GQLHTTP] Request failed with: ' + _context.t0.status + ' - ' + _context.t0.statusText);

            if (!_context.t0.data.hasOwnProperty('errors')) {
              _context.next = 33;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 15;

            for (_iterator = (0, _getIterator3.default)(_context.t0.data.errors); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              err = _step.value;

              console.error('[GQLHTTP] Error: ' + err.message);
            }
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t1 = _context['catch'](15);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 23:
            _context.prev = 23;
            _context.prev = 24;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 26:
            _context.prev = 26;

            if (!_didIteratorError) {
              _context.next = 29;
              break;
            }

            throw _iteratorError;

          case 29:
            return _context.finish(26);

          case 30:
            return _context.finish(23);

          case 31:
            _context.next = 34;
            break;

          case 33:
            console.error('[GQLHTTP] Error: ' + _context.t0.data);

          case 34:
            return _context.abrupt('return', result);

          case 35:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 8], [15, 19, 23, 31], [24,, 26, 30]]);
  }));
  return function _makeRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _DEFAULT_AX_CONFIG = {
  url: '/gql',
  method: 'GET',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json'
  }
};

function _promise(fn) {
  return new _promise3.default(function (res, rej) {
    fn(function (err, succ) {
      return err ? rej(err) : res(succ);
    });
  });
}

function graphQLClient(host, config) {
  if (config === undefined) {
    config = _DEFAULT_AX_CONFIG;
  }
  config.baseURL = host;
  var ax = _axios2.default.create(config);

  return {
    query: function query(_query, variables, opName) {
      return _makeRequest(ax, {
        params: {
          query: _query,
          variables: (0, _stringify2.default)(variables),
          operationName: opName
        }
      });
    },
    mutate: function mutate(query, variables, opName) {
      var _this = this;

      return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', _makeRequest(ax, {
                  data: {
                    query: query,
                    variables: variables,
                    opName: opName
                  },
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  // 'Content-Encoding': 'gzip'
                  method: 'POST'
                }));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }))();
    }
  };
}

exports.default = graphQLClient;
