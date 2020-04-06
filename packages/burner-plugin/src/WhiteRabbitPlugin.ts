import React from 'react';
import { BurnerPluginContext, Plugin, Actions, Asset } from '@burner-wallet/types';
import MoviePage from './ui/MoviePage';
import erc721Abi from './abis/erc721';

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
    return this.pluginContext!.getWeb3('100');
  }

  getMovieContract() {
    const web3 = this.getWeb3();
    return new web3.eth.Contract(erc721Abi as any, '0xe69170241be555b57dd67ede81307ab01eaaa443');
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }
}