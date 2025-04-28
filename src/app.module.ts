import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SpotifyModule } from './modules/spotify/spotify.module';
import { MusicBrainzModule } from './modules/music-brainz/music-brainz.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PGVectorService } from './configModules/pgVector.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
        imports : [ConfigModule],
        useFactory : (config : ConfigService) => ({
        type : 'postgres',
        host : config.get("DB_HOST"),
        port : +(config.get("DB_HOST") ?? 3306),
        username : config.get("DB_USERNAME"),
        password : config.get("DB_PASSWORD"),
        database : config.get("DB_NAME"),
        autoLoadEntities : true,
        migrations : ['dist/migrations/*.ts'],
        synchronize  : false,
        migrationsRun : true
        }),
        inject : [ConfigService],
    }),
    SpotifyModule,
    MusicBrainzModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PGVectorService],
})
export class AppModule {}
