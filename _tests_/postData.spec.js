const fetchMock = require('fetch-mock');
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  postData
} from '../src/client/js/app.js'

describe('postData fetch test', () => {

  it('can fetch', async () => {

    fetchMock.post("http://pixabay.com", JSON.stringify({
      city: "Seoul",
      picUrl: "http://pixabay.com/seoul/123.png"
    })
  );
    const response = await postData('http://pixabay.com');
    expect(response.city).toEqual("Seoul");
    expect(response.picUrl).toEqual("http://pixabay.com/seoul/123.png");
    expect(Object.keys(response).length).toEqual(2);
  })
})
