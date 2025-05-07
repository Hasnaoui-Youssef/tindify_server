import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Like {
  @PrimaryColumn()
  likerId : number;

  @PrimaryColumn()
  likedId : number;

  @CreateDateColumn()
  createdAt : Date;

}
