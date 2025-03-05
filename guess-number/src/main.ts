import { applets } from '@web-applets/sdk';

const context = applets.register();

context.data = { secret_number: Math.floor(Math.random() * 20) , result: "Guess a number between 1 and 20!" };

// Set number
context.setActionHandler('set_number', ({start, end}) => {
  const startNum = start ?? 1;
  const endNum = end ?? 20;
  const num = Math.floor(Math.random() * (endNum - startNum + 1)) + startNum;
  context.data = { secret_number: num , result: `Guess a number between ${startNum} and ${endNum}!` };
});

// Guess number
context.setActionHandler('guess', ({ guess }) => {
  const secretNumber = context.data.secret_number;
  let result: string;
  if (guess === secretNumber) {
    result = 'Correct. Good work!';
  } else if (guess < secretNumber) {
    result = 'Think higher!';
  } else {
    result = 'Think lower!';
  }
  context.data = { secret_number: secretNumber, result };
});

// Reset the number to nothing
context.setActionHandler('reset', () => {
  if(context.data.result === 'Correct!') {
    context.data = { secret_number: null, result: null };
  } else {
    context.data = { secret_number: null, result: "The number was " + context.data.secret_number + ". Try again!" };
  }
});

// Whenever the data is updated, update the view
context.ondata = () => {
  console.log(context.data);
  const resultElement = document.getElementById('result');
  if (resultElement) {
    resultElement.innerText = context.data.result;
  }
};
