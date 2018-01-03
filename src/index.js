import Event from './Event';
import Request from './Request';

function addQueryToUrl(url = '', query = {}) {
  const [base, params = ''] = url.split(/\?&?/);
  const data = Object.entries(query)
    .filter(([key, value]) => key !== '' && value !== null && value !== undefined)
    .map(([key, value]) => [key, convertQueryValueToString(value)])
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  const mark1 = data ? '?' : '';
  const mark2 = params ? '&' : '';
  return `${base}${mark1}${data}${mark2}${params}`;
}

function attachEvents(request, events = {}) {
  Object.entries(events).forEach(([key, value]) => {
    if (!['initialize', 'progress', 'load', 'error'].includes(key)) {
      request.addEventListener(key, () => dispatchEvent(key, request, {}, value));
    }
  });
  if (request.upload) {
    const wrap = method => (e) => {
      if (e.lengthComputable) {
        const { loaded, total } = e;
        const details = { loaded, total };
        dispatchEvent('progress', request, details, method);
      }
    };
    Object.entries(events).forEach(([key, value]) => {
      if (key === 'progress') {
        request.upload.addEventListener(key, wrap(value));
      }
    });
  }
}

function attachHeaders(request, headers) {
  Object.entries(headers).forEach(([key, value]) => {
    request.setRequestHeader(key, value);
  });
}

function convertInput(value) {
  if (typeof value === 'object') {
    return value;
  }
  return { url: value };
}

function convertQueryValueToString(value) {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return `${value}`;
}

function dispatchEvent(type, target, details, method) {
  const request = new Request(target);
  const event = new Event(type, request, details);
  method(event);
}

function extractData(response) {
  const text = response.responseText;
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function extractHeaders(response) {
  const headers = {};
  response
    .getAllResponseHeaders()
    .split(/\n/)
    .filter(item => item !== '')
    .forEach((item) => {
      const key = item.split(': ')[0];
      const value = item.split(': ')[1];
      headers[key] = value;
    });
  return headers;
}

function createFormData(fields = {}) {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => data.append(key, value));
  return data;
}

function headersContainContentType(headers = {}) {
  return Object.keys(headers)
    .map(item => item.toLowerCase() === 'content-type')
    .find(item => item);
}

function getSpecialBodyAndHeaders(body, headers = {}) {
  let newBody = body;
  const newHeaders = { ...headers };
  if (typeof body === 'object' && !(body instanceof File)) {
    const objContainsFile = Object.values(body).find(value => (value instanceof File));
    if (objContainsFile) {
      newBody = createFormData(body);
      if (!headersContainContentType(headers)) {
        newHeaders['Content-Type'] = 'multipart/form-data';
      }
    } else {
      newBody = JSON.stringify(body);
      if (!headersContainContentType(headers)) {
        newHeaders['Content-Type'] = 'application/json';
      }
    }
  }
  return {
    body: newBody,
    headers: newHeaders,
  };
}

function sendRequest(details = {}) {
  const {
    method = 'GET',
    url = '',
    headers = {},
    body = null,
    credentials = false,
    events = {},
  } = details;
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const onError = wrapOnError(events, reject);
    const onLoad = wrapOnLoad(events, resolve, onError);
    request.open(method.toUpperCase(), url);
    request.addEventListener('load', onLoad);
    request.addEventListener('error', onError);
    attachEvents(request, events);
    attachHeaders(request, headers);
    request.withCredentials = credentials;
    request.timeout = 60000;
    request.ontimeout = onError;
    request.send(body);
    Object.entries(events)
      .filter(([key]) => key === 'initialize')
      .forEach(([key, value]) => dispatchEvent('initialize', request, {}, value));
  });
}

function wrapOnError(events, reject) {
  return (e) => {
    const { target: request } = e;
    const { statusText, status } = request;
    const error = new Error(statusText);
    error.status = status;
    if (events.error) {
      dispatchEvent('error', request, { status }, events.error);
    }
    reject(error);
  };
}

function wrapOnLoad(events, resolve, onError) {
  return (e) => {
    const { target: request } = e;
    const { status } = request;
    if (status < 200 || status >= 300) {
      onError(e);
    } else {
      const data = {
        body: extractData(request),
        headers: extractHeaders(request),
        status,
      };
      if (events.progress) {
        const { loaded } = e;
        const details = { loaded, total: loaded };
        dispatchEvent('progress', request, details, events.progress);
      }
      if (events.load) {
        const details = { ...data };
        dispatchEvent('load', request, details, events.load);
      }
      resolve(data);
    }
  };
}

function verifyArguments(value) {
  const { url } = value;
  if (typeof url !== 'string' || !url) {
    throw new Error('missing url');
  }
}

export default function(input) {
  const details = convertInput(input);
  verifyArguments(details);
  const {
    url,
    query,
    body,
    headers,
    ...etc,
  } = details;
  const config = {
    ...etc,
    url: addQueryToUrl(url, query),
    ...getSpecialBodyAndHeaders(body, headers),
  };
  return sendRequest(config);
}
