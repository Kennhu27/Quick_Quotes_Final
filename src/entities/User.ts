import { Entity, PrimaryColumn, BeforeInsert, CreateDateColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn()
  userId: string;

  @BeforeInsert()
  generateId(): void {
    this.userId = uuidv7();
  }

  @CreateDateColumn()
  createdAt: Date;
}
