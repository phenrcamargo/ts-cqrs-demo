import { DateColumn } from "src/infrastructure/config/column-types";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("partners")
export class PartnerOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column()
  document!: string;

  @Column("int")
  documentType!: number;

  @Column("int")
  countryCode!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @DateColumn()
  createdAt!: Date;

  @DateColumn({ nullable: true })
  updatedAt?: Date;

  @DateColumn({ nullable: true })
  disabledAt?: Date;
}
