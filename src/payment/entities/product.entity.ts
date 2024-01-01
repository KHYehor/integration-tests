import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProductName } from '../enum/product-name';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: ProductName;

  @Column()
  description: string;
}
