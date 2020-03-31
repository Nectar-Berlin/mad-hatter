declare class WhiteRabbitClient {
    private iframe;
    url(tokenId: any): string;
    ensureIFrame(url: any): Promise<any>;
    requestPayment(tokenId: string): Promise<void>;
}
declare const _default: WhiteRabbitClient;
export default _default;
