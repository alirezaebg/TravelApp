const app = require ('../src/server/server')
import 'core-js/stable';
import 'regenerator-runtime/runtime';
const supertest = require('supertest')
const request = supertest(app)

describe('express server test', () => {

  it ('get request to homepage endpoint', async done => {
    const response =  await request.get('/')
    expect(response.status).toBe(200);
    done()
  })

});
