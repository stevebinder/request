import request from '../src/index.js';

request({
  url: 'http://www.msn.com',
  events: {
    initialize: (e) => {
      console.log('initialize:::', e);
    },
    progress: (e) => {
      console.log('progress:::', e);
    },
    load: (e) => {
      console.log('load:::', e);
    },
    error: (e) => {
      console.log('error:::', e);
    },
  },
}).then((r) => {
  console.log(r);
}).catch((e) => {
  console.log(e);
});

// async (() => {
//   const response = await request('data.json');
//   console.log('::::::1', response);
// })();

// request({
//   url: 'http://reddit.com/robots.txt',
//   events: {
//     initialize: (e) => {
//       console.log('initialize:::', e);
//     },
//     progress: (e) => {
//       console.log('progress:::', e);
//     },
//     load: (e) => {
//       console.log('load:::', e);
//     },
//     error: (e) => {
//       console.log('error:::', e);
//     },
//   },
// });

// request({
//   url: 'data-x.json',
//   events: {
//     initialize: (e) => {
//       console.log('initialize:::', e);
//     },
//     progress: (e) => {
//       console.log('progress:::', e);
//     },
//     load: (e) => {
//       console.log('load:::', e);
//     },
//     error: (e) => {
//       console.log('error:::', e);
//     },
//   },
// });