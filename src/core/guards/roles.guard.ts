
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride("roles", [
      context.getHandler(),
      context.getClass(),
    ]);


    if (!roles) {
      return true;
    }    
  
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const user = request.user;
  
    if (!user) {
      console.log('User not found in request');
      return false; 
    }

    return roles.some(role => user.role.includes(role));
  }
  
}
