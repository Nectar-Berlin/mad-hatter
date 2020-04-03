import React from 'react';
import ReactDOM from 'react-dom';
import WhiteRabbitClient from '@whiterabbitjs/client';

const client = new WhiteRabbitClient(process.env.WR_WALLET_HOST);

const StreamingApp = () => {

  const openWhiteRabbit = () => {
    console.log('Who is there?');
    client.requestPayment('2142160385');
  };

  return (
    <div>
      <button onClick={openWhiteRabbit}>Knock-knock</button>
    </div>
  );
}

ReactDOM.render(<StreamingApp />, document.getElementById('root'));

