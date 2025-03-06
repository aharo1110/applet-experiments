import { applets } from '@web-applets/sdk';

const context = applets.register();

// Convert action
context.setActionHandler('exchange', async ({ base_symbol, target_symbol, amount }) => {
  fetch(`https://api.frankfurter.dev/v1/latest?base=${base_symbol}&symbols=${target_symbol}`)
    .then((response) => response.json())
    .then((data) => {
        const convertBy = amount ?? 1;
        const rate = data.rates[target_symbol];
        const convertedAmount = (rate * convertBy).toFixed(2);
        context.data = {
          base_symbol,
          target_symbol,
          amount: convertBy,
          result: convertedAmount
        };
    })
    .catch((error) => {
        console.error('Error fetching exchange rate:', error);
        context.data = {
          result: 'Error'
        };
    });
});

// Whenever the data is updated, update the view
context.ondata = () => {
  if(context.data.result === 'Error') {
    document.body.innerHTML = `
      <div class="result">Error fetching exchange rate</div>
    `;
    return;
  }
  document.body.innerHTML = `
    <div class="conversion">${context.data.amount} ${context.data.base_symbol} in ${context.data.target_symbol}</div>
    <div class="result">${context.data.result} ${context.data.target_symbol}</div>
  `;
};
