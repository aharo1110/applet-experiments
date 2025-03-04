import { applets } from '@web-applets/sdk';

const context = applets.register();

// Set number
context.setActionHandler('set_number', (start?: number, end?: number) => {
  const startNum = start ?? 1;
  const endNum = end ?? 20;
  const num = Math.floor(Math.random() * (endNum - startNum + 1)) + startNum;
  context.data = { secret_number: num , result: "Guess a number between " + startNum + " and " + endNum + "!" };
});

// Guess number
context.setActionHandler('guess', (guess: number) => {
  const secretNumber = context.data.secret_number;
  if (guess === secretNumber) {
    context.data.result = 'Correct!';
  } else if (guess < secretNumber) {
    context.data.result = 'Higher!';
  } else {
    context.data.result = 'Lower!';
  }
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
  const resultElement = document.getElementById('result');
  if (resultElement) {
    resultElement.innerText = context.data.result;
  }
};
