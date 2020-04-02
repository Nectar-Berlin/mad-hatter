/**
 * Copyright (c) 2017-present, WhiteRabbit
 *
 * This source code is licensed under the Mozilla Public License, version 2,
 * found in the LICENSE file in the root directory of this source tree.
 */

pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

/**
 * @title MovieToken
 * @dev Simple ERC721 token mintable by whitelisted accounts
 */

contract MovieToken is ERC721Full, MinterRole {

  uint8 constant TYPE_IMDB = 0x01;

  constructor() public ERC721Full("Movie Token by WhiteRabbit", "WRT") MinterRole() {
  }

  function mintWithImdb(
    address _to,
    uint64 _imdbId
  ) public onlyMinter {
    // token structure:
    // 23 empty bytes,
    // 8 bytes imbdId,
    // 1 byte type
    uint256 tokenId = uint256(_imdbId) << 8 | TYPE_IMDB;
    super._mint(_to, tokenId);
  }

  function mint(
    address _to,
    uint8 _tokenType,
    uint248 _data
  ) public onlyMinter {
    uint256 tokenId = uint256(_data) << 8 | _tokenType;
    super._mint(_to, tokenId);
  }

  function burn(uint256 _tokenId) public onlyMinter {
    super._burn(ownerOf(_tokenId), _tokenId);
  }
}
