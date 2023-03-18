import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ type: "application/*+json" }));

const port = process.env.PORT;

// db connection
const config = {
  host: "localhost" || "",
  connectionString: process.env.POSTGRES_DB_URL,
};

const pool = new Pool(config);
//

app.get("/hello", async (request: Request, response: Response) => {
  const queryString = "select name from users";
  let result = await pool.query(queryString);

  // console.log(result.rows);

  response.json({
    response: result.rows,
  });
});

app.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  const queryString = `insert into users(name, email, password) values ('${name}', '${email}', '${encryptedPassword}') returning *`;
  let result = await pool.query(queryString);

  res.json({
    response: result.rows[0],
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
