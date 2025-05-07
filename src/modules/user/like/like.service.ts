import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepo : Repository<Like>,
    @InjectRepository(User) private userRepo : Repository<User>,
    private dataSource : DataSource
  ){}

  async createLike(likerId : number, likedId : number){
    return this.dataSource.transaction(async manager => {
      try {
        await manager.save(Like, {
          likerId,
          likedId,
        });
      } catch(err) {
        if(err.code === '23505'){
          return false;
        }
        throw err;
      }
      const mutualLike = await manager.findOne(Like, { where : {likerId : likedId, likedId : likerId}});
      if(mutualLike){
        const [u1, u2] = [likerId, likedId].sort((a, b) => a - b);
        await manager
          .createQueryBuilder()
          .relation(User, 'matches')
          .of(u1)
          .add(u2);
        return true;
      }
      return false;
    });
  }

}
