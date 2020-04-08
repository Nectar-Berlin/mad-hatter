import React from 'react';
import ReactDOM from 'react-dom';
import WhiteRabbitClient from '@whiterabbitjs/client';

const client = new WhiteRabbitClient(process.env.WR_WALLET_HOST);

type WhiteRabbitMessage = MessageEvent & {
  whiterabbit: {
    status: boolean;
  }
};

const StreamingApp = () => {

  const openWhiteRabbit = () => {
    client.requestPayment('2142160385');

    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.whiterabbit) return;
      const { whiterabbit } = event.data;
      console.log(whiterabbit);
      if (!whiterabbit.status) {
        client.closeIFrame();
      }
    });
  };

  return (
    <div>
      <button onClick={openWhiteRabbit}>Knock-knock</button>
    </div>
  );
}

ReactDOM.render(<StreamingApp />, document.getElementById('root'));

