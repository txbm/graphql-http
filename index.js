import axios from 'axios'

const _DEFAULT_AX_CONFIG = {
    url: '/gql',
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
}

async function _makeRequest (ax, config) {
  let result = null;
  try {
    let response = await ax.request(config);
    result = response.data;
  } catch (e) {
    console.error(`[GQLHTTP] Request failed with: ${ e.status } - ${ e.statusText }`);
    console.error(`[GQLHTTP] Error: ${ JSON.stringify(e.data) }`);
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
    query (query, variables) {
      return _makeRequest(ax, {
        data: {
          query,
          variables
        }
      });
    }
  };
}


export default graphQLClient
