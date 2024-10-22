import { Body, Controller, Get, Post, Render, HttpStatus, HttpException } from '@nestjs/common';
import axios from 'axios'; // Make sure to install axios

@Controller('input-page')
export class InputPageController {
  @Get('/')
  @Render('input-page')
  getInputPage() {
    return {};
  }

  @Post('submit')
  @Render('input-page') // Render the same page
  async submitInput(@Body('ethAmount') ethAmount: number) {
    const fee = 0.03; // Define the fee
    let responseData = {}; // Default response data

    try {
      // Fetch current prices of ETH and BTC from an API
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd');
      const ethPriceInUSD = response.data.ethereum.usd;
      const btcPriceInUSD = response.data.bitcoin.usd;

      // Calculate the total value of the ETH amount in USD
      const totalValueInUSD = ethAmount * ethPriceInUSD;

      // Calculate the equivalent amount in BTC without deducting the fee
      const equivalentBtcWithoutFee = totalValueInUSD / btcPriceInUSD;

      // Subtract the fee
      const finalAmountInUSD = totalValueInUSD - fee;

      // Calculate the equivalent amount in BTC after deducting the fee
      const equivalentBtcWithFee = finalAmountInUSD / btcPriceInUSD;

      // Prepare response data to render
      responseData = { 
        message: 'Conversion successful!', 
        btcWithoutFee: equivalentBtcWithoutFee.toFixed(6), // BTC amount without fee
        btcWithFee: equivalentBtcWithFee.toFixed(6), // BTC amount with fee
        ethAmount
      };
    } catch (error) {
      console.error('Error processing input:', error);
      throw new HttpException('Failed to process input', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return responseData; // Return the data for rendering
  }
}