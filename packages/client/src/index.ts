
const frameCss = `
  height: 400px;
  width: 300px;
  right: 0;
  position: absolute;
  border:1px solid lightgray;
  display: none;  
  top: 0;`;

const closeHandleCss = `
  right: 0;
  position: absolute;
  background: lightgray;
  padding: 2px 5px;
  cursor: pointer ;
  top: 401;`;

const loaderCss = `
  display: flex;
  justify-content: center;
  align-items: center;`;

class WhiteRabbitClient {
  private iframe: any = null;
  private host: string;

  constructor(host: string = 'https://wr.leap.rocks') {
    console.log({ host });
    this.host = host;
  }

  private url(tokenId) {
    console.log(this.host);
    return `${this.host}/title/${tokenId}`;
  }

  private ensureIFrame(url) {
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
      const closeHandle = document.createElement('div');
      closeHandle.appendChild(document.createTextNode('×'));
      closeHandle.style.cssText = closeHandleCss;
      closeHandle.addEventListener('click', () => {
        document.body.removeChild(this.iframe);
        document.body.removeChild(closeHandle);
        this.iframe = null;
      });
      
      document.body.appendChild(this.iframe);
      document.body.appendChild(closeHandle);
    });
  }

  requestPayment(imdbOrTokenId: string) {
    const tokenId = imdbOrTokenId.startsWith('tt') 
      ? this.imdbToToken(imdbOrTokenId) 
      : imdbOrTokenId;

    return this.ensureIFrame(this.url(tokenId));
  }

  imdbToToken(imdbId: string) {
    return `01${imdbId.replace('tt', '').padStart(8, '0')}`;
  }
}

export default WhiteRabbitClient;