import { IUserWithoutAuth } from "./types";

declare global {
  namespace Express {
    interface Request {
      identity?: IUserWithoutAuth;
    }
  }
}
