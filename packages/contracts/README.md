# White Rabbit Contracts

contracts for the first registry of movies.

Token contract on xDAI: `0xe69170241be555b57dd67ede81307ab01eaaa443`

fist token minted: https://blockscout.com/poa/xdai/tokens/0xe69170241be555b57dd67ede81307ab01eaaa443/instance/2142160385/token_transfers

## Read/Write instructions

Copy `.env.template` to `.env` and fill in a mnemonic phrase to complete the truffle config. Then the following commands will start the truffle console.

```sh
npm run compile
npm run console
```

Interact with the contract by creating and instance and reading/writing from/to it as follows:
```
> const token = await MovieToken.at("0xe69170241be555b57dd67ede81307ab01eaaa443")
> token.ownerOf(2142160385);
'0xb82974e7f4386F0BbC7180fdbeda27F457d0A60b'
```

## Format of token identifiers

Each token identifier in the Movie Token contract can hold data to indentify the movie it represents. Until now we have only one type the IMDB-ID:

| type | name | format                                        | example                      |
|------|------|-----------------------------------------------|------------------------------|
| 1    | IMDB | 23 empty bytes + 8 bytes IMBDID + 1 type byte | 0x0...000066778899aabbccdd01 |

More token types will be added in the future.