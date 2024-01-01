export class PurchaseResponseDto {
  constructor(args: { generatedCode: string }) {
    this.generatedCode = args.generatedCode;
  }

  public generatedCode: string;
}
