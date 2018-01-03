# Request

A React component for video playback with some notable features:
- Uses a simple inline promise implementation with async/await
- Provides event hooks to provide additional details like progress
- Exposes a way to cancel pending requests

### Configuration

|key|type|required|default|description|
|---|---|---|---|---|
|url|string|yes|""|the request endpoint|
|method|string|no|"GET"|the request method|
|headers|object|no|null|key/value pairs to set as request headers|
|body|any|no|null|the request body payload|
|credentials|bool|no|false|should cookies and authorization headers be sent with the request|
|events|object|no|null|key/value pairs of types/methods to attach event listeners|

### Simple Usage

```javascript
  try {
    const response = request('data.json');
    const { body, headers, status } = response;
  } catch (e) {
    const { message, status } = e;
  }
```


### Advanced Usage

```javascript
  request({
    url: 'http://example.com/data.json',
    events: {
      initialize: (e) => {
        const { type, target } = e;
        // store a reference to "target" in order to call
        // target.cancel() to cancel the request
      },
      progress: (e) => {
        const { type, target, loaded, total } = e;
      },
      error: (e) => {
        const { type, target, message, status } = e;
      },
      load: (e) => {
        const { type, target, body, headers, status } = e;
      },
    },
  });
```

### Development
1. Start a local server (so that loading data works crossdomain)
2. Run ```npm run dev``` to start the webpack watcher
3. Make changes to ```test/index.js```
4. Open ```http://{local-server}/test``` in your web browser

### Deployment
1. Increment the version in **package.json**
2. Run ```npm run build```
3. Merge the changes to the master branch on GitHub
4. Release a new version on GitHub matching the version from ```package.json```
