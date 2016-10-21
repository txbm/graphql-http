import axios from 'axios'
import { stringify } from 'querystring'

const _DEFAULT_AX_CONFIG = {
    url: '/gql',
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json'
    }
}

async function _makeRequest (ax, config) {
  let result = null;
  try {
    let response = await ax.request(config);
    result = response.data;
  } catch (e) {
    console.error(`[GQLHTTP] Request failed with: ${ e.status } - ${ e.statusText }`);
    if (e && e.data && e.data.hasOwnProperty('errors')) {
      for (let err of e.data.errors) {
        console.error(`[GQLHTTP] Error: ${ err.message }`);
      }
    } else {
      console.error(`[GQLHTTP] Error: ${ e }`);
    }
  }
  return result;
}


function graphQLClient (host, config) {
  if (config === undefined) {
    config = _DEFAULT_AX_CONFIG;
  }
  config.baseURL = host;
  let ax = axios.create(config);

  return {
    query (query, variables, opName, extra = {}) {
      return _makeRequest(ax, {
        params: {
          query,
          variables: JSON.stringify(variables),
          operationName: opName
        },
        ...extra
      });
    },
    mutate (query, variables, opName, { headers = {}, ...restExtra } = {}) {
      // @TODO Get Gzip support working
      return _makeRequest(ax, {
        data: {
          query,
          variables,
          opName
        },
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Encoding': 'gzip'
          ...headers
        },
        method: 'POST',
        ...restExtra
      });
    }
  };
}


export default graphQLClient

