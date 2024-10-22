import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import fetch from 'node-fetch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { CryptoPrice } from './entities/crypto-price.entity';  // Entity for saving prices
import * as moment from 'moment';

@Injectable()
export class MoralisService {
  private readonly apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBhMjNkNGQ2LTZlODktNDczYi05Y2M0LWJlODE2NGVhMTI3MiIsIm9yZ0lkIjoiNDExNDQ2IiwidXNlcklkIjoiNDIyODI0IiwidHlwZUlkIjoiZDM5NGY4MjktZmQ4MC00MmZiLWIzMDQtY2QzM2U3MWNlYmVhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjg3Mjg1MTEsImV4cCI6NDg4NDQ4ODUxMX0.UTRDJrOqvQB2FFeDWKbmx0glAS7TT07P89S0Okz4pKY'; // Replace with your API key
  private readonly baseUrl = 'https://deep-index.moralis.io/api/v2.2/wallets';

  constructor(
    @InjectRepository(CryptoPrice)
    private cryptoPriceRepository: Repository<CryptoPrice>,
  ) {}


  // Function to get prices for the last 24 hours, including current price
  async getPricesForLast24Hours(symbol: string): Promise<any> {
    // Get the current time and 24 hours ago
    const currentTime = moment().toDate();
    const twentyFourHoursAgo = moment().subtract(24, 'hours').toDate();

    // Query prices within the last 24 hours
    const prices = await this.cryptoPriceRepository
        .createQueryBuilder('price')
        .where('price.symbol = :symbol', { symbol })
        .andWhere('price.timestamp BETWEEN :start AND :end', {
            start: twentyFourHoursAgo,
            end: currentTime,
        })
        .orderBy('price.timestamp', 'ASC')
        .getMany();

    // Get the most recent/current price (the latest in the list)
    const currentPrice = prices.length ? prices[prices.length - 1] : null;

    // Filter prices to get the most recent price for each hour
    const hourlyPrices: { [key: string]: any } = {};

    prices.forEach(price => {
        const hour = moment(price.timestamp).format('YYYY-MM-DD HH'); // Group by hour
        // Only keep the latest price for each hour
        if (!hourlyPrices[hour] || moment(price.timestamp).isAfter(hourlyPrices[hour].timestamp)) {
            hourlyPrices[hour] = price;
        }
    });

    // Convert the hourlyPrices object to an array
    const hourlyPricesArray = Object.values(hourlyPrices);

    return {
        prices: hourlyPricesArray, // Array of prices for the last 24 hours (hourly)
        currentPrice, // Latest price
    };
  }


  // Fetch price from 1 hour ago for a specific token
  async getPriceFromOneHourAgo(token: string): Promise<number | null> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const previousPrice = await this.cryptoPriceRepository.findOne({
      where: { symbol: token, timestamp: LessThan(oneHourAgo) },
      order: { timestamp: 'DESC' },  // Get the most recent price before one hour ago
    });

    return previousPrice ? previousPrice.price : null;
  }

  // Method to fetch token balances from Moralis API
  async getWalletTokenBalancesPrice(contractAddress: string, chain: string): Promise<any> {
    const url = `${this.baseUrl}/${contractAddress}/tokens?chain=${chain}`;
    const headers = {
      "Accept": "*/*",
      "User-Agent": "NestJS Service",
      "X-API-Key": this.apiKey,
    };

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new HttpException(
          `Error fetching token price: ${response.statusText}`,
          HttpStatus.BAD_REQUEST
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw new HttpException(
        'Failed to fetch token price from Moralis',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Method to save crypto prices to MySQL
  async saveCryptoPrice(symbol: string, price: number): Promise<void> {
    const newPrice = this.cryptoPriceRepository.create({ symbol, price });
    await this.cryptoPriceRepository.save(newPrice);
  }
}
