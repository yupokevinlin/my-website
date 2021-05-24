import * as express from "express";
import * as path from "path";
import { Express } from "express";
import { Server } from "http";
import * as compress from "compression";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";

export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  public async setup(port: number) {
    const server = express();
    this.setupStandardMiddlewares(server);
    this.addStaticFiles(server);
    this.addPage(server);
    this.httpServer = this.listen(server, port);
    this.server = server;
    this.addEndPoints(server);
    return this.server;
  }

  public listen(server: Express, port: number) {
    return server.listen(port);
  }

  public kill() {
    if (this.httpServer) this.httpServer.close();
  }

  private setupStandardMiddlewares(server: Express) {
    server.use(bodyParser.json());
    server.use(cookieParser());
    server.use(compress());
  }

  private addStaticFiles(server: Express) {
    server.use(express.static(path.join(__dirname, "../../../client/build")));
  }

  private addPage(server: Express) {
    server.get(["/"], function(req, rsp) {
      rsp.sendFile(path.join(__dirname, "../../../client/build/index.html"));
    });
  }

  private addEndPoints(server: Express) {

  }
}

export default ExpressServer;
