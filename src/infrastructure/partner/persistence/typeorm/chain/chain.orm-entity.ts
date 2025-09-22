import { DateColumn } from "src/infrastructure/config/column-types";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("chains")
export class ChainOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  companyId!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column("int")
  currency_code!: number;

  @Column("int")
  country_code!: number;

  @DateColumn()
  createdAt!: Date;

  @DateColumn({ nullable: true })
  updatedAt?: Date;

  @DateColumn({ nullable: true })
  disabledAt?: Date;
}
