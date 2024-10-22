import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MoralisService } from './moralis/moralis.service';
import { EmailService } from './email.service';

@Injectable()
export class PriceSchedulerService {
  constructor(
    private readonly moralisService: MoralisService,
    private readonly emailService: EmailService,
) {}

  @Cron('0 */5 * * * *')  // Run every 5 minutes
  async handleCron() {
    console.log('Cron job running every 5 minutes');
    const ethChain = '0x1';  // Ethereum Chain ID
    const polygonChain = '0x89';  // Polygon Chain ID
    const address = '0xcB1C1FdE09f811B294172696404e88E658659905';  // Your wallet address

    try {
      // Fetch balances for Ethereum and Polygon
      const ethBalance = await this.moralisService.getWalletTokenBalancesPrice(address, ethChain);
      const polygonBalance = await this.moralisService.getWalletTokenBalancesPrice(address, polygonChain);

      // Log API results for troubleshooting
      console.log('ETH Balance:', ethBalance);
      console.log('Polygon Balance:', polygonBalance);

      // Extract ETH and Polygon prices from the API result
      const ethPrice = ethBalance.result.find(token => token.symbol === 'ETH')?.usd_price;
      const polygonPrice = polygonBalance.result.find(token => token.symbol === 'POL')?.usd_price;


      // Fetch prices from 1 hour ago
      const ethPriceOneHourAgo = await this.moralisService.getPriceFromOneHourAgo('ETH');
      const polygonPriceOneHourAgo = await this.moralisService.getPriceFromOneHourAgo('MATIC');

      // Save the prices to the database
      if (ethPrice) {
        await this.moralisService.saveCryptoPrice('ETH', ethPrice);
        console.log('ETH price saved:', ethPrice);
      } else {
        console.error('ETH price not found');
      }

      if (polygonPrice) {
        await this.moralisService.saveCryptoPrice('MATIC', polygonPrice);
        console.log('Polygon price saved:', polygonPrice);
      } else {
        console.error('Polygon price not found');
      }

      // Check percentage increase for ETH
      if (ethPrice && ethPriceOneHourAgo) {
        const ethPercentageIncrease = ((ethPrice - ethPriceOneHourAgo) / ethPriceOneHourAgo) * 100;
        if (ethPercentageIncrease > 3) {
          await this.emailService.sendPriceAlert('ETH', ethPercentageIncrease);
        }
      }

      // Check percentage increase for MATIC
      if (polygonPrice && polygonPriceOneHourAgo) {
        const polygonPercentageIncrease = ((polygonPrice - polygonPriceOneHourAgo) / polygonPriceOneHourAgo) * 100;
        if (polygonPercentageIncrease > 3) {
          await this.emailService.sendPriceAlert('MATIC', polygonPercentageIncrease);
        }
      }
    } catch (error) {
      console.error('Error in cron job:', error);  // Log errors
    }
  }
}

