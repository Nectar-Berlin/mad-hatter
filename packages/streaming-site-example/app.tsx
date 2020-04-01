import React from 'react';
import ReactDOM from 'react-dom';
import WhiteRabbitClient from '@whiterabbitjs/client';

const StreamingApp = () => {

  const openWhiteRabbit = () => {
    console.log('Who is there?');
    WhiteRabbitClient.requestPayment('132');
  };

  return (
    <div>
      <button onClick={openWhiteRabbit}>Knock-knock</button>
    </div>
  );
}

ReactDOM.render(<StreamingApp />, document.getElementById('root'));

