
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

type WhiteRabbitMessage = MessageEvent & {
  whiterabbit: {
    status: boolean;
  }
};

class WhiteRabbitClient {
  private iframe: any = null;
  private closeHandle: any = null;
  private host: string;

  constructor(host: string = 'https://wr.leap.rocks') {
    this.host = host;
  }

  private url(tokenId: string) {
    return `${this.host}/movie/${tokenId}`;
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
      ? WhiteRabbitClient.imdbToToken(imdbOrTokenId) 
      : imdbOrTokenId;

    await this.ensureIFrame(this.url(tokenId));

    return new Promise((resolve, reject) => {
      const messageHandler = (event) => {
        if (!event.data || !event.data.whiterabbit) return;
        const { whiterabbit } = event.data as WhiteRabbitMessage;
        console.log(whiterabbit);
        this.closeIFrame();
        window.removeEventListener('message', messageHandler);
        resolve({ status: whiterabbit.status });
      };

      window.addEventListener('message', messageHandler);
    });
  }

  static imdbToToken(imdbId: string) {
    return String((Number(imdbId.replace('tt', '')) << 8) + IdTypes.IMDB);
  }

  static tokenToImdb(tokenId: string) {
    const type:number = Number(tokenId) % 256;
    if (type !== IdTypes.IMDB) {
      throw Error('Invalid type. Should be 1 for IMDB ID');
    }
    return String(Number(tokenId) >> 8);
  }
}

export default WhiteRabbitClient;