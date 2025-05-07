import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  firstName : string;

  @Column()
  lastName : string;

  @Column()
  email : string;

  @OneToMany(type => Photo, photo=>photo.user)
  photos : Photo[];

  @Column()
  embedding : string;

  @ManyToMany(() => User)
  @JoinTable({
    name : "user_matches",
    joinColumn : { name : "user_id1" },
    inverseJoinColumn: { name : "user_id2" }
  })
  matches : User[];
}
