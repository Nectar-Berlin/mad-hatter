import Client from './dist';

describe('#imdbToToken', () => {
  test('should prefix with 01', () => {
    expect(Client.imdbToToken('tt18367814')).toEqual('0118367814');
  });

  test('should pad ID to 8 bytes', () => {
    expect(Client.imdbToToken('tt8367814')).toEqual('0108367814');
  });

  test('should ignore imdb prefix', () => {
    expect(Client.imdbToToken('18367814')).toEqual('0118367814');
    expect(Client.imdbToToken('8367814')).toEqual('0108367814');
  });
});