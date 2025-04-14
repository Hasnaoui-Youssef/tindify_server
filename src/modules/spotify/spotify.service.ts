import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SpotifyAccessToken } from './dto/access_token.dto';

@Injectable()
export class SpotifyService {

  private readonly logger = new Logger(SpotifyService.name);
  private accessToken : string = "";

  constructor(
    private readonly configService : ConfigService,
    private readonly httpService : HttpService
  ){};

  async getAccessToken() : Promise<SpotifyAccessToken>{
    const baseUrl = this.configService.getOrThrow<string>('SPOTIFY_AUTH_URI');
    const clientID = this.configService.getOrThrow<string>('CLIENT_ID');
    const clientSecret = this.configService.getOrThrow<string>('CLIENT_SECRET');
    const b64Token = btoa([clientID, ":", clientSecret].join(""));
    const authHeader = "Basic " + b64Token;
    const response = await firstValueFrom(
      this.httpService.post<SpotifyAccessToken>(`${baseUrl}/api/token`,{grant_type : "client_credentials"},
      {
        headers : {
          Authorization : authHeader,
          "Content-Type" : "application/x-www-form-urlencoded"
        }}).pipe(
        catchError((error : AxiosError)=> {
          this.logger.error(error.response.data);
          throw "Unable to get token";
        })
      ));
    this.accessToken = response.data.access_token;
    return response.data;
  }
  async getTrackInfo(trackId : string) {
    if(!this.accessToken){
      this.logger.error("Empty access token");
      throw "Empty access token";
    }
    this.logger.log("Access token : " + this.accessToken);
    const baseUrl = this.configService.getOrThrow<string>('SPOTIFY_API_URI');
    const response = await firstValueFrom(
      this.httpService.get<SpotifyAccessToken>(`${baseUrl}/tracks/${trackId}`,
      {
        headers : {
          Authorization : `Bearer ${this.accessToken}`,
        }}).pipe(
        catchError((error : AxiosError)=> {
          this.logger.error(error.response.data);
          throw "Unable to get token";
        })
      ));
    return response.data;
  }
}
