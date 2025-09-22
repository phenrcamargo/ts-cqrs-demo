import { Column, ColumnOptions } from "typeorm";

export function DateColumn(options: ColumnOptions = {}) {
  return Column({
    type: process.env.DB_TYPE === "sqlite" ? "datetime" : "timestamp",
    ...options,
  });
}
