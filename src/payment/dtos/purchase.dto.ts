import { ProductName } from '../enum/product-name';
import { IsEnum, IsNumber } from 'class-validator';

export class PurchaseDto {
  @IsNumber()
  public userId: number;

  @IsEnum(ProductName)
  public product: ProductName;
}
