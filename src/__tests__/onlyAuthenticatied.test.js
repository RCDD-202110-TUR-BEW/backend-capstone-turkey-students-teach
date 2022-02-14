/* eslint-disable no-undef */
const onlyAuthenticated = require('../middleware/onlyAuthenticated');

describe('only authenticated middleware', () => {
  it('should throw an error if there is no cookie with the request', (done) => {
    const req = {};
    expect(onlyAuthenticated.bind(this, req, {}, () => {})).toThrow();
    done();
  });
  test('should throw error when cookie is empty', () => {
    const req = {
      cookies: {},
    };
    expect(onlyAuthenticated.bind(this, req, {}, () => {})).toThrow();
  });
});
