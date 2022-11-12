import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./app/proxy/route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8000;
app.use("/proxy", router);
app.get("/", (req: Request, res: Response) => {
  res.send("backend running");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
