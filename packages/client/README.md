# WhiteRabbit client

Simple frontend library to integrate WhiteRabbit on your streaming website

## Usage

Install `@whiterabbit/client` package

```sh
npm install --save @whiterabbit/client
```

Then use it on your webpage

```js
import WhiteRabbitClient from '@whiterabbit/client';

WhiteRabbitClient.requestPayment('tt8367814');
```

## API

`requestPayment(tokenId)`
\
Request a payment for the movie referenced by given WhiteRabbit token (TBD)

`requestPayment(imdbId)`
\
Request a payment by movie's imdb ID. Example: `tt8367814`.

`imdbToToken(imdbId)`
\
Convert given `imdbId` to WhiteRabbit token.