'use strict';

var fetchMock = require('fetch-mock');

var GQL = require('../');

describe('GQLClient', function() {
  afterEach(function () {
    fetchMock.restore();
  });

  pit('should work', function () {
    fetchMock.get('*', {
      body: {data: {whatwhat: true}},
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    var client = GQL.GQLClient('https://example.com/gql');

    return client.query('query{whatwhat}').then(function (result) {
      expect(result).toEqual({
        data: {whatwhat: true}
      });
    });
  });

  pit('should properly not work with 200', function () {
    fetchMock.get('*', {
      body: {errors: [{message: 'you don fucked up'}]},
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

    var client = GQL.GQLClient('https://example.com/gql');

    return client.query('query{whatwhat}').then(fail, function (error) {
      expect(error instanceof GQL.GraphQLResponseError).toBe(true);

      expect(error.message).toMatch(/1 error\(s\)/);
      expect(error.message).toMatch(/you don fucked up/);
    });
  });

  pit('should properly not work with different status code', function () {
    fetchMock.get('*', {
      body: {errors: [{message: 'you don fucked up'}]},
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      status: 400
    });

    var client = GQL.GQLClient('https://example.com/gql');

    return client.query('query{whatwhat}').then(fail, function (error) {
      expect(error instanceof GQL.GraphQLResponseError).toBe(true);

      expect(error.message).not.toMatch(/1 error\(s\)/);
      expect(error.message).toMatch(/Received status 400/);
      expect(error.message).toMatch(/you don fucked up/);
    });
  });
});
