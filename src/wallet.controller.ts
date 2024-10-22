import { Controller, Get, Header } from '@nestjs/common';
import { MoralisService } from './moralis/moralis.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly moralisService: MoralisService) {}

  @Get('balance')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  async getBalance() {
    const chain = '0x89'; // Chain ID for Polygon (Matic)
    const address = '0xcB1C1FdE09f811B294172696404e88E658659905';
    
    const balances = await this.moralisService.getWalletTokenBalancesPrice(address, chain);
    return { balances };  // Wrap in an object to return JSON
  }

  @Get('last24hours')
  async getPricesForLast24Hours() {
    try {
      const ethPrices = await this.moralisService.getPricesForLast24Hours('ETH');
      const maticPrices = await this.moralisService.getPricesForLast24Hours('MATIC');
  
      return {
        ethPrices: ethPrices.prices,       // ETH prices for the last 24 hours
        currentEthPrice: ethPrices.currentPrice,  // Latest ETH price
        maticPrices: maticPrices.prices,   // MATIC prices for the last 24 hours
        currentMaticPrice: maticPrices.currentPrice, // Latest MATIC price
      };
    } catch (error) {
      console.error('Error fetching prices:', error);
      // throw new InternalServerErrorException('Failed to fetch prices'); // Respond with an appropriate error message
    }
  }
}