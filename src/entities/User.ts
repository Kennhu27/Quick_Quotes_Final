import { Entity, PrimaryColumn, BeforeInsert } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity()
export class Quote {
  @PrimaryColumn()
  quoteId: string;

  @BeforeInsert()
  generateId(): void {
    this.quoteId = uuidv7();
  }
}