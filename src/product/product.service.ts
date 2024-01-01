import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PurchaseDto } from '../payment/dtos/purchase.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(protected readonly configService: ConfigService) {}

  protected key = crypto
    .createHash('sha512')
    .update(this.configService.get<string>('SECRET_KEY'))
    .digest('hex')
    .substring(0, 32);

  protected encryptionIV = crypto
    .createHash('sha512')
    .update(this.configService.get<string>('SECRET_IV'))
    .digest('hex')
    .substring(0, 16);

  public generateCode({ userId, product }: PurchaseDto): string {
    const cipher = crypto.createCipheriv(
      this.configService.get<string>('ENCRYPTION_METHOD'),
      this.key,
      this.encryptionIV,
    );

    cipher.update(userId + product, 'utf-8', 'hex');
    return cipher.final('hex');
  }
}
