import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
 constructor(private reflector:Reflector) {}
 canActivate(context:ExecutionContext) {
  const roles=this.reflector.getAllAndOverride<string[]>('roles',[context.getHandler(),context.getClass()]);
  return !roles || roles.includes(context.switchToHttp().getRequest().user?.role);
 }
}
