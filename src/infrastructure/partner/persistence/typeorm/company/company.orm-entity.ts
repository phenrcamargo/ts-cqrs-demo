import { DateColumn } from "src/infrastructure/config/column-types";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("companies")
export class CompanyOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  partnerId!: string;

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
