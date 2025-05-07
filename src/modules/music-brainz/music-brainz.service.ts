import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { SongQueryDTO } from './dto/songQuery.dto';
import { AxiosError } from 'axios';
import { AcousticBrainzResponse } from './dto/AcousticBrainzResponse.dto';
import { processFeatures } from 'src/binding';

@Injectable()
export class MusicBrainzService {
  private readonly logger = new Logger(MusicBrainzService.name);
  private musicBrainzBaseUrl : string;
  private acousticBrainzBaseUrl : string;
  private readonly batchSize = 25;
  constructor(
    private readonly configService : ConfigService,
    private readonly httpService : HttpService,
  ){
    this.musicBrainzBaseUrl = this.configService.getOrThrow<string>("MUSIC_BRAINZ_URI");
    this.acousticBrainzBaseUrl = this.configService.getOrThrow<string>("ACOUSTIC_BRAINZ_URI");
  }

  async getSongMBID(songName : string){
    const resp = await firstValueFrom(
      this.httpService
        .get<SongQueryDTO>(`${this.musicBrainzBaseUrl}/recording/?query=recording:${songName}&fmt=json`)
        .pipe(catchError((error : AxiosError) => {
          this.logger.error(error.message);
          throw "Unable to get song data";
        }))
    );
    if(resp.data.count == 0){
      return { id : "" };
    }
    return resp.data.recordings[0];
  }
  async getUserTopTracksFeatures(mbids : string[]) : Promise<number[]> {
    mbids = mbids.filter((item) => item.length !== 0);
    const queries : string[] = [];
    for (let i = 0; i < mbids.length; i+= this.batchSize){
      queries.push(mbids.slice(i, i + this.batchSize).join(";"));
    }
    const respArr = await Promise.all(queries.map(async (query) => {
      return firstValueFrom(
        this.httpService
        .get<AcousticBrainzResponse>(`${this.acousticBrainzBaseUrl}/api/v1/high-level?recording_ids=${query}`)
        .pipe(catchError((error : AxiosError) => {
          this.logger.error(error.message);
          throw "Unable to get features for songs";
        }))
      );
    }));
    const resp : any = {};
    for (const r of respArr){
      for(const [key, val] of Object.entries(r.data)){
        if(key !== "mbid_mapping") resp[key] = val;
      }
    }
    if(!resp){
      throw new Error("Unable to get any song please retry");
    }
    const dataVector : number[][] = [];
    for(const id of mbids){
      if(!(id in resp)) continue;
      const record = resp[id]["0"];
      if(!record.highlevel) continue;
      const recordVector : number[] = [];
      for(const [field, details] of Object.entries(record.highlevel)){
        if(field === "metadata" || !details || typeof details !== "object") continue;
        if("all" in details){
          for(const val of Object.values(details.all)){
            recordVector.push(val);
          }
        }
        dataVector.push(recordVector);
      }
    }
    if(dataVector.length === 0) {
      throw new Error("user vector has no values");
    }
    const userData : number[] = processFeatures(dataVector);
    this.logger.log(userData);
    return userData;
  }
}
