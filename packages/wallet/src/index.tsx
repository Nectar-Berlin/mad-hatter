import React from 'react';
import ReactDOM from 'react-dom';
import { xdai } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import { LocalSigner } from '@burner-wallet/core/signers';
import { XDaiGateway, } from '@burner-wallet/core/gateways';
import ModernUI from '@burner-wallet/modern-ui';

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new XDaiGateway(),
  ],
  assets: [xdai],
});

const BurnerWallet = () =>
  <ModernUI
    core={core}
    plugins={[]}
  />



ReactDOM.render(<BurnerWallet />, document.getElementById('root'));

