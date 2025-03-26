import { CustomJwtPayload } from './custom-jwt-payload';

declare module 'express-serve-static-core' {
  interface Request {
    user?: CustomJwtPayload;
  }
}
