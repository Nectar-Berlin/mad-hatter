import React from 'react';
import { BurnerPluginContext, Plugin, Asset } from '@burner-wallet/types';
import MoviePage from './ui/MoviePage';
import erc721Abi from './abis/erc721';
import config from './config.json';

export default class WhiteRabbitPlugin implements Plugin {
  private _pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;
    pluginContext.addPage('/movie/:tokenId', MoviePage as React.FC);
  }

  getAsset(): Asset {
    return this.pluginContext.getAssets()[0];
  }

  getWeb3() {
    return this.pluginContext!.getWeb3(config.networkId);
  }

  getMovieContract() {
    const web3 = this.getWeb3();
    return new web3.eth.Contract(erc721Abi as any, config.tokenAddress);
  }

  getPaymentAmount() {
    return config.paymentAmount;
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('WhiteRabbitPlugin is not initialized');
    }
    return this._pluginContext;
  }
}