import { Module } from '@nestjs/common';
import { MusicBrainzService } from './music-brainz.service';
import { MusicBrainzController } from './music-brainz.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [
    HttpModule,
  ],
  controllers: [MusicBrainzController],
  providers: [MusicBrainzService],
  exports : [MusicBrainzService]
})
export class MusicBrainzModule {}
