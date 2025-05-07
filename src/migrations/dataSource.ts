import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type : "postgres",
  host : "localhost",
  port: 5432,
  username : "postgres",
  password: "artemezia",
  database : "tindify",
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/*{.ts,.js}'],
})

dataSource.initialize()
  .then(() => {
    console.log('Running migrations...');
    return dataSource.runMigrations();
  })
  .then(() => {
    console.log('Migrations completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed', err);
    process.exit(1);
  });
