import { utils } from './';

const { imdbToToken, tokenToImdb } = utils;

test('#imdbToToken', () => {  
  expect(imdbToToken('tt8367814')).toEqual('2142160385');
  expect(imdbToToken('8367814')).toEqual('2142160385');
});

describe('#tokenToImdb', () => {
  test('should have 01 suffix', () => {
    expect(tokenToImdb('2142160385')).toEqual('8367814');
  });

  test('should thrown if type is not IMDB', () => {
    expect(
      () => tokenToImdb('2142160386')
    ).toThrowError(new Error('Invalid type. Should be 1 for IMDB ID'));
  })
});
