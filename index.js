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
    response = await ax.post('/gql', config);
    if (response.status !== 200) {
      console.warn('[GQLHTTP] Request returned non-200 code...');
    }
    result = response.data;
  } catch (e) {
    console.error(`[GQLHTTP] Request failed with: ${ e.status } - ${ e.statusText }`);
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
    query (qry, vrb) {
      return _makeRequest(ax, {
        data: JSON.stringify({ qry, vrb})
      });
    }
  };
}


export default graphQLClient
