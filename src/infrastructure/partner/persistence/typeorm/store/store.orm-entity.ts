import { Column, Entity, PrimaryColumn } from "typeorm";
import { AddressOrmVO } from "./address-orm-vo";
import { DateColumn } from "src/infrastructure/config/column-types";

@Entity("stores")
export class StoreOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  chainId!: string;

  @Column()
  document!: string;

  @Column("int")
  documentType!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  phone!: string;

  @Column(() => AddressOrmVO)
  address!: AddressOrmVO;

  @DateColumn()
  createdAt!: Date;

  @DateColumn({ nullable: true })
  updatedAt?: Date;

  @DateColumn({ nullable: true })
  disabledAt?: Date;
}
