import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1745862940907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("CREATE EXTENSION IF NOT EXISTS vector");
      await queryRunner.query(`
        CREATE TABLE "user" (
          "id" SERIAL PRIMARY KEY,
          "firstName" VARCHAR NOT NULL,
          "lastName" VARCHAR NOT NULL,
          "email" VARCHAR NOT NULL,
          "embedding" VECTOR(355)
          )
      `);
      await queryRunner.query(`
        CREATE TABLE "photo" (
          "id" SERIAL PRIMARY KEY,
          "uri" VARCHAR NOT NULL,
          "userId" REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "photo"`);
      await queryRunner.query(`DROP TABLE "user"`);
    }

}
