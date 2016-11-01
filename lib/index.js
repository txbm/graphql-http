'use strict';

var merge = require('lodash.merge');
var url = require('url');
var fetch = require('isomorphic-fetch');
var qs = require('querystring');

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
  this.options = options;
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

  return fetch(this.url + '?' + params, this.options).then(function (resp) {
    if (resp.ok) {
      return handleResponse(resp);
    } else if (/json/.test(resp.headers.get('Content-Type'))) {
      return handleJSONErrorResponse(resp);
    } else {
      return handleUnknownErrorResponse(resp);
    }
  });
};

GQLClient.prototype.mutate = function (query, variables) {
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

  return fetch(this.url + '?' + params, merge({
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({query: query, variables: variables})
  }, this.options)).then(function (resp) {
    if (resp.ok) {
      return handleResponse(resp);
    } else if (/json/.test(resp.headers.get('Content-Type'))) {
      return handleJSONErrorResponse(resp);
    } else {
      return handleUnknownErrorResponse(resp);
    }
  });
};

exports.GQLClient = GQLClient;

function handleResponse (resp) {
  return resp.json().then(function (body) {
    if (resp.errors && resp.errors.length > 0) {
      throw new GraphQLResultError(
        'Received ' + resp.errors.length + ' error(s) from GraphQL',
        {
          response: resp,
          body: body
        }
      );
    } else {
      return body;
    }
  });
}

function handleJSONErrorResponse (resp) {
  return resp.json().then(function (body) {
    throw new GraphQLResponseError(
      'Received status ' + resp.status + ' from GraphQL',
      {
        response: resp,
        body: body
      }
    );
  });
}

function handleUnknownErrorResponse (resp) {
  throw new GraphQLResponseError(
    'Received status ' + resp.status + ' from GraphQL with unknown content type "' + resp.headers.get('Content-Type'),
    {
      response: resp
    }
  );
}

function GraphQLError (message, details) {
  this.message = message;
  this.details = details;

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
  value: GraphQLError.name
});

exports.GraphQLError = GraphQLError;

function GraphQLResultError (message, details) {
  this.message = message;
  this.details = details;

  if (message instanceof Error) {
    this.message = message.message;
    this.stack = message.stack;
  } else if (Error.captureStackTrace) {
    Error.captureStackTrace(this, GraphQLResultError);
  }
}

GraphQLResultError.prototype = Object.create(GraphQLError.prototype);
GraphQLResultError.prototype.constructor = GraphQLResultError;

Object.defineProperty(GraphQLResultError.prototype, 'name', {
  value: GraphQLResultError.name
});

exports.GraphQLResultError = GraphQLResultError;

function GraphQLResponseError (message, details) {
  this.message = message;
  this.details = details;

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
  value: GraphQLResponseError.name
});

exports.GraphQLResponseError = GraphQLResponseError;
