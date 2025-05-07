import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';


@Injectable()
export class PGVectorService implements OnModuleInit {

  constructor(private dataSource : DataSource){}

  async onModuleInit() {
     await this.dataSource.query("CREATE EXTENSION IF NOT EXISTS vector");
  }
}


