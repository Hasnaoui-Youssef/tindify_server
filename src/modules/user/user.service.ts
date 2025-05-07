import { Injectable } from '@nestjs/common';
import { MusicBrainzService } from '../music-brainz/music-brainz.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import * as pgvector from 'pgvector/pg';

@Injectable()
export class UserService{

  constructor(
    private mbService : MusicBrainzService,
    @InjectRepository(User) private userRepo : Repository<User>,
    @InjectRepository(Photo) private photoRepo : Repository<Photo>,
    private dataSource : DataSource,
  ){}

  async createUser(createUserDto : CreateUserDTO) : Promise<User> {
    const songMBIDs = await Promise.all(
      createUserDto.songs.map((song) => {
        return this.mbService.getSongMBID(song);
      })
    )
    const embedding = await this.mbService.getUserTopTracksFeatures(songMBIDs.map(item => item.id));
    return await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        firstName : createUserDto.firstName,
        lastName : createUserDto.lastName,
        email : createUserDto.email,
        embedding : pgvector.toSql(embedding),
      });
      const savedUser = await manager.save(User, user);
      const photos = createUserDto.photos.map( (photo) => { return {...photo, user : savedUser}});
      await manager.save(Photo, photos);
      return savedUser;
    })
  }
  async getUser(userId : number) {

    const userWithPhotos = await this.userRepo.createQueryBuilder('user')
      .leftJoinAndSelect(Photo, 'photo', 'photo.userId = user.id')
      .where('user.id = :userId', {userId})
      .getOne();
    return userWithPhotos;
  }
  async findAll() {
    return this.userRepo.find();
  }
  async getUserSuggestions(userId : number, skips : number = 0) {
    const user = await this.userRepo.findOne({
      where : { id : userId },
      select : ['embedding']
    });
    if(!user){
      throw new Error("User not found");
    }
    const embArr = user.embedding.replace("[","").replace("]","").split(",").map((e)=>+e);
    const res = await this.userRepo.createQueryBuilder("users")
      .where('id != :userId')
      .orderBy('embedding <-> :embedding')
      .setParameters({userId, embedding : pgvector.toSql(embArr)})
      .limit(10)
      .offset(skips * 10)
      .getMany();
    return res;
  }
  async getMatches(userId : number) {
    return this.userRepo
      .createQueryBuilder("user")
      .innerJoin("user_matches", "match",
        `("match"."user_id1" = "user"."id" AND "match"."user_id2" = :userId) OR ("match"."user_id2" = "user"."id" AND "match"."user_id1" = :userId)`, {userId}
      )
      .where(`"user"."id" != :userId`, {userId})
      .getMany();
  }
}
