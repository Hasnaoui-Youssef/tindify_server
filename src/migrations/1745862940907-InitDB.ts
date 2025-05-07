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
          "embedding" vector(355)
          )
      `); // TODO add location
      await queryRunner.query(`
        CREATE TABLE "photo" (
          "id" SERIAL PRIMARY KEY,
          "uri" VARCHAR NOT NULL,
          "userId" integer NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
      await queryRunner.query(`
        CREATE TABLE "like" (
          "likerId" integer NOT NULL,
          "likedId" integer NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          PRIMARY KEY ("likerId", "likedId"),
          FOREIGN KEY ("likerId") REFERENCES "user"("id") on delete cascade,
          FOREIGN KEY ("likedId") REFERENCES "user"("id") on delete cascade
        );
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_LIKE_LIKER" on "like" ("likerId");
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_LIKE_LIKED" on "like" ("likedId");
      `)
      await queryRunner.query(`
        CREATE TABLE "user_matches" (
          "user_id1" integer not null,
          "user_id2" integer not null,
          PRIMARY KEY("user_id1", "user_id2"),
          FOREIGN KEY ("user_id1") REFERENCES "user"("id") on delete cascade,
          FOREIGN KEY ("user_id2") REFERENCES "user"("id") on delete cascade,
          check("user_id1" < "user_id2")
        );
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_USER_MATCH_1" on "user_matches" ("user_id1");
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_USER_MATCH_2" on "user_matches" ("user_id2");
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "like"`);
      await queryRunner.query(`DROP TABLE "user_matches"`);
      await queryRunner.query(`DROP TABLE "photo"`);
      await queryRunner.query(`DROP TABLE "user"`);
    }

}
