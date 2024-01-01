import { Body, Controller, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PurchaseDto } from './dtos/purchase.dto';

@Controller('payment')
export class PaymentController {
  constructor(readonly paymentService: PaymentService) {}

  @Put()
  public pay(@Body() purchaseDto: PurchaseDto) {
    return this.paymentService.purchase(purchaseDto);
  }
}
