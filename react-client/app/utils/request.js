import 'whatwg-fetch';
import apisauce from 'apisauce';

import messages from './messages';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

const create = () => {
  const api = apisauce.create({
    baseURL: '/',
    'Cache-Control': 'no-cache',
    'X-Device-Type': 'NORMAL',
  });

  const get = (url, parameters = {}) => executeRequest(() => api.get(url, parameters));
  const post = (url, object = {}) => executeRequest(() => api.post(url, object));
  const put = (url, object = {}) => executeRequest(() => api.put(url, object));

  const executeRequest = (req) => new Promise((resolve) => {
    resolve(req().then((res) => {
      let errorMessageCode;
      if (res.problem === 'NETWORK_ERROR' || res.problem === 'CONNECTION_ERROR') {
        errorMessageCode = messages.networkError;
      } else if (res.problem === 'SERVER_ERROR') {
        errorMessageCode = messages.serverError;
      } else if (res.problem === 'TIMEOUT_ERROR') {
        errorMessageCode = messages.timeoutError;
      } else if (res.status === 401) {
        errorMessageCode = messages.unauthorizedError;
      }

      return { ...res, errorMessageCode };
    }));
  });

  return {
    get,
    post,
    put,
  };
};

export const doRequest = create();

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}
