import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  URI : string;

  @ManyToOne(type => User, user => user.photos)
  user : User;
}
