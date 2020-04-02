
/**
 * Copyright (c) 2017-present, WhiteRabbit
 *
 * This source code is licensed under the Mozilla Public License, version 2,
 * found in the LICENSE file in the root directory of this source tree.
 */


const MovieToken = artifacts.require('MovieToken');

contract('MovieToken', (accounts) => {

  describe('Test', () => {
    let token;

    beforeEach(async () => {
      token = await MovieToken.new();
    });

    it('can mint token for imdb', async () => {
      const imdbId = 1122334455;
      const receipt = await token.mintWithImdb(accounts[1], imdbId);
      const { tokenId } = receipt.logs[0].args; // eslint-disable-line no-underscore-dangle
      assert.equal('1', tokenId.toString().slice(-1));
      const owner = await token.ownerOf(tokenId);
      assert.equal(owner, accounts[1]);
    });
  });
});