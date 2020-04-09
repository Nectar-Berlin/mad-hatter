import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import WhiteRabbitClient from '@whiterabbitjs/client';

const client = new WhiteRabbitClient(process.env.WR_WALLET_HOST);

const StreamingApp = () => {
  const [paymentStatus, setPaymentStatus] = useState();

  const openWhiteRabbit = () => {
    client.requestPayment('2142160385').then(({ status }: { status: boolean }) => {
      setPaymentStatus(status);
    });
  };

  return (
    <div>
      <button onClick={openWhiteRabbit}>Knock-knock</button>
      {paymentStatus !== undefined &&
        <div>Payment: {paymentStatus ? 'success' : 'declined'}</div>
      }
    </div>
  );
}

ReactDOM.render(<StreamingApp />, document.getElementById('root'));

