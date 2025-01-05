import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as jwt from "jsonwebtoken";
@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(private readonly _configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const path = req.url;

    if (path.includes('auth'))
      return next(); 
    

    const token = req.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException({ message: 'No token provided' });
    }

    const tokenWithoutBearer = token.split(' ')[1];
    if (!tokenWithoutBearer) {
      throw new UnauthorizedException({ message: 'Token format is invalid' });
    }

    try {
      const decoded = jwt.verify(tokenWithoutBearer, this._configService.get('JWT_SECRET'));

      const expirationDate = decoded['exp'];
      const now = Math.floor(Date.now() / 1000);
      if (expirationDate < now) {
        throw new UnauthorizedException({ message: 'Token has expired' });
      }

      next();
    } catch (error) {
      throw new UnauthorizedException({ message: 'Invalid or expired token' });
    }
  }
}
