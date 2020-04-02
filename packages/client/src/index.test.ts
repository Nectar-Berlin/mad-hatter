import Client from './';

const client = new Client();

describe('#imdbToToken', () => {
  test('should prefix with 01', () => {
    expect(client.imdbToToken('tt18367814')).toEqual('0118367814');
  });

  test('should pad ID to 8 bytes', () => {
    expect(client.imdbToToken('tt8367814')).toEqual('0108367814');
  });

  test('should ignore imdb prefix', () => {
    expect(client.imdbToToken('18367814')).toEqual('0118367814');
    expect(client.imdbToToken('8367814')).toEqual('0108367814');
  });
});