import React from 'react';
import ReactDOM from 'react-dom';
import { xdai } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { XDaiGateway, } from '@burner-wallet/core/gateways';
import Exchange, { XDaiBridge } from '@burner-wallet/exchange';
import ModernUI from '@burner-wallet/modern-ui';

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new XDaiGateway(),
  ],
  assets: [xdai],
});

const exchange = new Exchange({
  pairs: [new XDaiBridge()],
});

const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

