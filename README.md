# Request

A Javascript function for making cancelable requests.


### Simple Usage

```javascript
  try {
    const { data, headers } = await request('data.json');
  } catch (e) {
    const { message, status } = e;
  }
```


### Event Listening

```javascript
  request({
    url: 'http://example.com/data.json',
    events: {
      error: e => console.log(e.message),
      initialize: e => {},
      load: e => console.log(e.headers, e.data),
      progress: e => console.log(e.bytes, e.total),
    },
  });
```

### Cancelling a Request

```javascript
  request({
    url: 'http://example.com/data.json',
    events: {
      initialize: e => {
        const pendingRequest = e.target;
        setTimeout(() => pendingRequest.abort(), 2000);
      },
    },
  });
```
