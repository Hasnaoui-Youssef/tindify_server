import { Controller } from '@nestjs/common';
import { MusicBrainzService } from './music-brainz.service';

@Controller('music-brainz')
export class MusicBrainzController {
  constructor(private readonly musicBrainzService: MusicBrainzService) {}
}
