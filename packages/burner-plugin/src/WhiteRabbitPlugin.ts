import React from 'react';
import { BurnerPluginContext, Plugin, Actions, Asset } from '@burner-wallet/types';
import MoviePage from './ui/MoviePage';

export default class WhiteRabbitPlugin implements Plugin {
  private _pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this._pluginContext = pluginContext;
    pluginContext.addPage('/movie/:tokenId', MoviePage as React.FC);
  }

  getAsset(): Asset {
    return this.pluginContext.getAssets()[0];
  }

  getWeb3(network: string) {
    return this.pluginContext.getWeb3(network);
  }

  get pluginContext() {
    if (!this._pluginContext) {
      throw new Error('Exchange not initialized');
    }
    return this._pluginContext;
  }
}