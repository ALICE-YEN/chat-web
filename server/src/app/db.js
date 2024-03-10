import pg from "pg";
import config from "config";

const dbConfig = config.get("postgres");

const db = new pg.Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  max: dbConfig.maxConnections,
});

export default await db;
