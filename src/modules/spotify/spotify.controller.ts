import { Controller, Get, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get()
  getAccessToken(){
    return this.spotifyService.getAccessToken();
  }
  @Get(":id")
  getSongInfo(@Param("id") id : string){
    return this.spotifyService.getTrackInfo(id);
  }
}
