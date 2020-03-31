
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
      this.iframe = document.createElement('iframe');
      this.iframe.src = url;
      this.iframe.style.cssText = 'height:400px; width:200px; border:1px solid red';
      this.iframe.addEventListener('load', () => resolve());

      document.body.appendChild(this.iframe);
    });
  }

  async requestPayment(tokenId: string) {
    await this.ensureIFrame(this.url(tokenId));
  }
}

export default new WhiteRabbitClient();