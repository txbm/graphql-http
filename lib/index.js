'use strict';

var merge = require('lodash.merge');
var url = require('url');
var qs = require('querystring');

require('isomorphic-fetch');

function GQLClient (url, options) {
  if (!(this instanceof GQLClient)) {
    return new GQLClient(url, options);
  }

  if (options == null) {
    options = {};
  }

  if (url == null) {
    throw new TypeError('GQLClient must have a url');
  }

  this.url = url;
  this.options = Object.assign({method: 'get'}, options);
}

GQLClient.prototype.configure = function (options) {
  return new GQLClient(this.url, merge({}, this.options, options));
};

GQLClient.prototype.query = function (query, variables) {
  if (query == null) {
    throw new TypeError('got ' + query + ' for GQLClient#query query');
  }

  if (variables == null) {
    variables = {};
  }

  var params = qs.stringify({
    query: query,
    variables: JSON.stringify(variables)
  });

  var requestUrl = this.url + '?' + params;

  var method = this.options.method.toLowerCase();

  if (method === 'get') {
    var fetchOptions = this.options.fetch;
  } else if (method === 'post') {
    var fetchOptions = merge({
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({query: query, variables: variables})
    }, this.options.fetch);
  } else {
    throw new TypeError('Unknown value "' + method + '" for method parameter');
  }

  return fetch(requestUrl, fetchOptions)
    .then(handleResponse);
};

GQLClient.prototype.mutate = function (query, variables) {
  if (this.options.method.toLowerCase() !== 'post') {
    return this.configure({method: 'post'}).query(query, variables);
  } else {
    return this.query(query, variables);
  }
};

exports.GQLClient = GQLClient;

function handleResponse (resp) {
  if (resp.ok) {
    return handleOkayResponse(resp);
  } else if (/json/.test(resp.headers.get('Content-Type'))) {
    return handleJSONErrorResponse(resp);
  } else {
    return handleUnknownErrorResponse(resp);
  }
}

function handleOkayResponse (resp) {
  return resp.json().then(function (body) {
    if (body == null) {
      throw formatErrors(
        'Missing/null body response from GraphQL.',
        body
      );
    } else if (body.errors instanceof Array && body.errors.length > 0) {
      throw formatErrors(
        'Received ' + body.errors.length + ' error(s) from GraphQL.',
        body
      );
    } else {
      return body;
    }
  });
}

function formatErrors (message, body) {
  if (body != null && body.errors instanceof Array) {
    var errorMessages = body.errors.map(errorToMessage);

    return new GraphQLResponseError(
      [message].concat(errorMessages).join('\n')
    );
  } else {
    return new GraphQLResponseError(
      [
        message,
        'Unrecognized body structure "' + JSON.stringify(body) + '"'
      ].join('\n')
    );
  }
}

function handleJSONErrorResponse (resp, body) {
  return resp.json().then(function (body) {
    var message = 'Received status ' + resp.status + ' from GraphQL.';

    throw formatErrors(message, body);
  });
}

function errorToMessage (error) {
  if (error != null && error.message != null) {
    return error.message;
  } else {
    return JSON.stringify(error);
  }
}

function handleUnknownErrorResponse (resp) {
  var message = 'Received status ' + resp.status + ' from GraphQL.';

  throw formatErrors(message, {
    errors: [{
      message: 'Unknown content type "' + resp.headers.get('Content-Type') + '".'
    }]
  });
}

function GraphQLError (message) {
  this.message = message;

  if (message instanceof Error) {
    this.message = message.message;
    this.stack = message.stack;
  } else if (Error.captureStackTrace) {
    Error.captureStackTrace(this, GraphQLError);
  }
}

GraphQLError.prototype = Object.create(Error.prototype);
GraphQLError.prototype.constructor = GraphQLError;

Object.defineProperty(GraphQLError.prototype, 'name', {
  value: 'GraphQLError'
});

exports.GraphQLError = GraphQLError;

function GraphQLResponseError (message) {
  this.message = message;

  if (message instanceof Error) {
    this.message = message.message;
    this.stack = message.stack;
  } else if (Error.captureStackTrace) {
    Error.captureStackTrace(this, GraphQLResponseError);
  }
}

GraphQLResponseError.prototype = Object.create(GraphQLError.prototype);
GraphQLResponseError.prototype.constructor = GraphQLResponseError;

Object.defineProperty(GraphQLResponseError.prototype, 'name', {
  value: 'GraphQLResponseError'
});

exports.GraphQLResponseError = GraphQLResponseError;
