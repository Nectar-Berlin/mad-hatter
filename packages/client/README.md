# WhiteRabbit client

Simple frontend library to integrate WhiteRabbit on your streaming website

## Usage

Install `@whiterabbitjs/client` package

```sh
npm install --save @whiterabbitjs/client
```

Then use it on your webpage

```js
import WhiteRabbitClient from '@whiterabbitjs/client';

const client = new WhiteRabbitClient();

client.requestPayment('tt8367814');
```

## API

`new WhiteRabbitClient(whiterabbitHost)`
\
Create a new client instance.
\
Arguments:

- `whiterabbitHost` — (optional) host of whiterabbit wallet instance. Defaults to `https://wr.leap.rocks`.

`requestPayment(tokenId)`
\
Request a payment for the movie referenced by given WhiteRabbit token (TBD).

`requestPayment(imdbId)`
\
Request a payment by movie's imdb ID. Example: `tt8367814`.

`imdbToToken(imdbId)`
\
Convert given `imdbId` to WhiteRabbit token.
