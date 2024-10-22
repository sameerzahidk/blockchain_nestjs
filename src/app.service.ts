import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHtml(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Crypto Prices</title>
      </head>
      <body>
        <h1>Crypto Prices (Last 24 Hours)</h1>
        
        <h2>Current ETH Price: <span id="current-eth-price"></span></h2>
        <h2>Current Polygon Price: <span id="current-matic-price"></span></h2>

        <h3>ETH Prices (Last 24 Hours)</h3>
        <ul id="eth-prices-list"></ul>

        <h3>Polygon Prices (Last 24 Hours)</h3>
        <ul id="matic-prices-list"></ul>

        <p><b>Note: To get swap price for ETH to BTC go to ULR: "localhost:3000/input-page"</b></p>

        <script>
          async function fetchPrices() {
            const response = await fetch('/wallet/last24hours');
            const data = await response.json();

            // Display current prices
            document.getElementById('current-eth-price').innerText = data.currentEthPrice?.price || 'N/A';
            document.getElementById('current-matic-price').innerText = data.currentMaticPrice?.price || 'N/A';

            // Display ETH prices
            const ethPricesList = document.getElementById('eth-prices-list');
            data.ethPrices.forEach(price => {
              const li = document.createElement('li');
              li.innerText = \`Price: \${price.price} USD - Time: \${new Date(price.timestamp).toLocaleTimeString()}\`;
              ethPricesList.appendChild(li);
            });

            // Display MATIC prices
            const maticPricesList = document.getElementById('matic-prices-list');
            data.maticPrices.forEach(price => {
              const li = document.createElement('li');
              li.innerText = \`Price: \${price.price} USD - Time: \${new Date(price.timestamp).toLocaleTimeString()}\`;
              maticPricesList.appendChild(li);
            });
          }

          // Fetch prices on page load
          window.onload = fetchPrices;
        </script>
      </body>
      </html>
    `;
  }
}
