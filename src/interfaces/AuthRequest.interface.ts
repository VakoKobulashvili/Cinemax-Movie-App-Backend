import { Request } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export default AuthRequest;
