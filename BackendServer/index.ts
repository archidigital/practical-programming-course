import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { DatabaseError, Pool } from "pg";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ type: "application/*+json" }));

const port = process.env.PORT;
const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "";

// db connection
const config = {
  host: "localhost" || "",
  connectionString: process.env.POSTGRES_DB_URL,
};

const pool = new Pool(config);
//

function generateAccessToken(userId: string) {
  return jwt.sign(userId, TOKEN_SECRET);
}


app.get("/api", async (request: Request, response: Response) => {
  response.status(200).send("hello from server");
});

app.get("/api/hello", async (request: Request, response: Response) => {
  const queryString = "select name from users";
  let result = await pool.query(queryString);

  // console.log(result.rows);

  response.json({
    response: result.rows,
  });
});

app.post("/api/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  const queryString = `insert into users(name, email, password) values ('${name}', '${email}', '${encryptedPassword}') returning *`;
  try {
    let result = await pool.query(queryString);
    res.json({
      response: {
        success: true,
      },
    });
  } catch (error) {
    const dbError = error as DatabaseError;
    res.json({
      response: {
        success: false,
        message: dbError.detail,
      },
    });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const queryString = `select id, password from users where email='${email}'`;
  let result = await pool.query(queryString);

  const encryptedPassword = result.rows[0].password;
  const userId = result.rows[0].id;

  const isSamePassword = await bcrypt.compare(password, encryptedPassword);

  const token = generateAccessToken(userId);

  res.json({
    response: {
      success: isSamePassword,
      userId: userId,
      token: token,
    },
  });
});

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET, (err: any, userId: any) => {
    console.log("err", err);
    console.log("userId", userId);

    if (err) return res.sendStatus(403);

    // req.user = user

    next();
  });
}

app.get("/api/me", authenticateToken, async (req: Request, res: Response) => {
  // get user data from db

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const userId = jwt.decode(token ?? "");

  const queryString = `select name from users where id='${userId}'`;
  let result = await pool.query(queryString);

  res.json({
    response: {
      success: true,
      name: result.rows[0].name,
    },
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
