
const frameCss = `
  height: 400px;
  width: 300px;
  right: 0;
  position: absolute;
  border:1px solid lightgray;
  display: none;  
  top: 0;`;

const loaderCss = `
  display: flex;
  justify-content: center;
  align-items: center;`;

class WhiteRabbitClient {
  private iframe: any = null;

  private url(tokenId) {
    return `https://wr.leap.rocks/title/${tokenId}`;
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
      
      document.body.appendChild(this.iframe);
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

export default new WhiteRabbitClient();