import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './modules/spotify/spotify.module';
import { MusicBrainzModule } from './modules/music-brainz/music-brainz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    SpotifyModule,
    MusicBrainzModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
