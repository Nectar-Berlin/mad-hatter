
const frameCss = `
  height: 500px;
  width: 400px;
  right: 0;
  position: absolute;
  border: none;
  display: none;  
  top: 0;`;

const closeHandleCss = `
  right: 0;
  position: absolute;
  background: lightgray;
  padding: 2px 5px;
  cursor: pointer ;
  top: 501;`;

const loaderCss = `
  display: flex;
  justify-content: center;
  align-items: center;`;

enum IdTypes {
  NA,
  IMDB,
};

type MovieData = {
  title: string;
  posterUrl: string;
  director: string;
  producer: string;
  actors: Array<string>;
  productionCompanies: Array<string>;
};

type WhiteRabbitClientConfig = {
  host?: string;
  theMovieDbApiKey?: string;
}

const defaultConfig: WhiteRabbitClientConfig = {
  host: 'https://wr.leap.rocks',
  theMovieDbApiKey: 'b1854cc7cd8f2e29da75a04a3c946e44'
};

type WhiteRabbitMessage = {
  whiterabbit: {
    status: boolean;
  }
};

class WhiteRabbitClient {
  private iframe: any = null;
  private config: WhiteRabbitClientConfig;
  private closeHandle: any = null;

  constructor(config?: WhiteRabbitClientConfig) {
    this.config = Object.assign({}, defaultConfig, config);
  }

  private url(tokenId: string) {
    return `${this.config.host}/movie/${tokenId}`;
  }

  private ensureCloseHandle() {
    if (this.closeHandle) return this.closeHandle;
    this.closeHandle = document.createElement('div');
    this.closeHandle.appendChild(document.createTextNode('×'));
    this.closeHandle.style.cssText = closeHandleCss;
    this.closeHandle.addEventListener('click', () => this.closeIFrame());
    return this.closeHandle;
  }

  private ensureIFrame(url: string) {
    if (this.iframe) {
      return Promise.resolve(this.iframe);
    }

    return new Promise((resolve) => {
      const loader = document.createElement('div');
      loader.style.cssText = frameCss + loaderCss;
      loader.appendChild(document.createTextNode('Loading..'));
      document.body.appendChild(loader);

      this.iframe = document.createElement('iframe');
      this.iframe.src = url;
      this.iframe.style.cssText = frameCss;
      this.iframe.addEventListener('load', () => {
        this.iframe.style.cssText += 'display: block';
        document.body.removeChild(loader);
        resolve();
      });
      const closeHandle = this.ensureCloseHandle();
      
      document.body.appendChild(this.iframe);
      document.body.appendChild(closeHandle);
    });
  }

  closeIFrame() {
    document.body.removeChild(this.iframe);
    document.body.removeChild(this.closeHandle);
    this.iframe = null;
    this.closeHandle = null;
  }

  async requestPayment(imdbOrTokenId: string) {
    const tokenId = imdbOrTokenId.startsWith('tt') 
      ? utils.imdbToToken(imdbOrTokenId) 
      : imdbOrTokenId;

    await this.ensureIFrame(this.url(tokenId));

    return new Promise((resolve) => {
      const messageHandler = (event: MessageEvent) => {
        if (!event.data || !event.data.whiterabbit) return;
        const { whiterabbit } = event.data as WhiteRabbitMessage;
        this.closeIFrame();
        window.removeEventListener('message', messageHandler);
        resolve({ status: whiterabbit.status });
      };

      window.addEventListener('message', messageHandler);
    });
  }

  async getMovieDetails(imdbId: string): Promise<MovieData> {
    const [details, credits] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/tt${imdbId}?api_key=${this.config.theMovieDbApiKey}`
      ).then(resp => resp.json()),
      fetch(
        `https://api.themoviedb.org/3/movie/tt${imdbId}/credits?api_key=${this.config.theMovieDbApiKey}`
      ).then(resp => resp.json())
    ]);

    const { title, poster_path, production_companies } = details;
    const { cast, crew } = credits;

    const productionCompanies = production_companies.slice(0, 2).map((c: any) => c.name);
    const actors = cast.slice(0, 3).map((a: any) => a.name);
    const producer = crew.find((c: any) => c.job === 'Producer').name;
    const director = crew.find((c: any) => c.job === 'Director').name;

    return {
      title,
      posterUrl: `https://image.tmdb.org/t/p/w500${poster_path}`,
      director,
      producer,
      actors,
      productionCompanies
    };
  }
}

const utils = {
  imdbToToken: (imdbId: string) => {
    return String((Number(imdbId.replace('tt', '')) << 8) + IdTypes.IMDB);
  },

  tokenToImdb: (tokenId: string) => {
    const type:number = Number(tokenId) % 256;
    if (type !== IdTypes.IMDB) {
      throw Error('Invalid type. Should be 1 for IMDB ID');
    }
    return String(Number(tokenId) >> 8);
  }
};

export {
  WhiteRabbitClient,
  utils,
  WhiteRabbitMessage,
  MovieData,
  WhiteRabbitClientConfig,
  IdTypes
};