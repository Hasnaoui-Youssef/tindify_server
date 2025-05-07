import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Photo } from './entities/photo.entity';
import { MusicBrainzModule } from '../music-brainz/music-brainz.module';
import { Like } from './entities/like.entity';
import { LikeService } from './like/like.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([User, Photo, Like]),
    MusicBrainzModule,
  ],
  controllers: [UserController],
  providers: [UserService, LikeService],
  exports : [TypeOrmModule],
})
export class UserModule {}
