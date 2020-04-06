import React from 'react';
import ReactDOM from 'react-dom';
import { xdai } from '@burner-wallet/assets';
import BurnerCore from '@burner-wallet/core';
import ModernUI from '@burner-wallet/modern-ui';
import { LocalSigner } from '@burner-wallet/core/signers';
import { XDaiGateway, } from '@burner-wallet/core/gateways';
import { createGlobalStyle } from 'styled-components'
import WhiteRabbitPlugin from '@whiterabbitjs/burner-plugin';

const GlobalStyle = createGlobalStyle`
  body {
    background: #000000 !important;
  }

  header,
  header div {
    color: rgba(255, 255, 255, 0.9) !important;
  }

  header button {
    border: none;
  }
  
`;

const core = new BurnerCore({
  signers: [new LocalSigner()],
  gateways: [
    new XDaiGateway(),
  ],
  assets: [xdai],
});

const WhiteRabbitWallet = () =>
  <React.Fragment>
    <GlobalStyle/>
    <ModernUI
      title="White Rabbit"
      core={core}
      plugins={[
        new WhiteRabbitPlugin()
      ]}
    />
  </React.Fragment>


ReactDOM.render(<WhiteRabbitWallet />, document.getElementById('root'));

