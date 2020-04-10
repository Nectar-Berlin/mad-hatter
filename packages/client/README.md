# WhiteRabbit client

Simple frontend library to integrate WhiteRabbit on your streaming website.

## Usage

Install `@whiterabbitjs/client` package

```sh
npm install --save @whiterabbitjs/client
```

Then use it on your webpage

```js
import { WhiteRabbitClient } from '@whiterabbitjs/client';

const client = new WhiteRabbitClient();

client.requestPayment('tt8367814');
```

## WhiteRabbitClient API

### `new WhiteRabbitClient(whiterabbitConfig)`

Create a new client instance.

Arguments:

* `whiteRabbitConfig` — config object with attributes:

  * `host` — (optional) host of whiterabbit wallet instance. Defaults to `https://wr.leap.rocks`
  * `theMovieDbApiKey` — (optional) API key for themoviedb.org. Consider getting your own key if you use `getMovieData` API on your website.

### `client.requestPayment(tokenId)`

Request a payment for the movie referenced by given WhiteRabbit token (TBD). Returns a Promise which resolves with the status of the payment.

Arguments:

* `tokenId` — tokenId for the MovieToken

### `client.requestPayment(imdbId)`

Request a payment by movie's imdb ID. Example: `tt8367814`. Returns a Promise which resolves with the status of the payment.

Arguments:

* `imdbId` — imdbID for the Movie.

### `client.getMovieDetails(imdbId)`

Returns movie details from themoviedb.org API.

Arguments:

* `imdbId` — imdbID for the Movie.

Response:

```ts
{
  title: string;
  posterUrl: string;
  director: string;
  producer: string;
  actors: Array<string>;
  productionCompanies: Array<string>;
}
```

## Utils API

```js
import { utils } from '@whiterabbitjs/client';
```

### `utils.imdbToToken(imdbId)`

Convert given `imdbId` to WhiteRabbit token.

Arguments:

* `imdbId` — imdbID for the Movie.

### `utils.tokenToImdb(tokenId)`

Convert given WhiteRabbit `tokenId` to imdbId.

Arguments:

* `tokenId` — tokenId for the MovieToken.
