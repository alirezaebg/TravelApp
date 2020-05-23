const fetchMock = require('fetch-mock');
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  postForm
} from '../src/client/js/travelInfo.js'

describe('postForm fetch test', () => {

  it('can fetch', async () => {

    fetchMock.post("http://geonamesApi.com", JSON.stringify({
      city: "Chicago",
      country: "USA"
    })
  );
    const response = await postForm('http://geonamesApi.com');
    expect(response.city).toEqual("Chicago");
    expect(response.country).toEqual("USA");
    expect(Object.keys(response).length).toEqual(2);
  })
})
