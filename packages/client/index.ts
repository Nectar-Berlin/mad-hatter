
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

  url(tokenId) {
    return `https://wr.leap.rocks/title/${tokenId}`;
  }

  ensureIFrame(url) {
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

  async requestPayment(tokenId: string) {
    await this.ensureIFrame(this.url(tokenId));
  }
}

export default new WhiteRabbitClient();