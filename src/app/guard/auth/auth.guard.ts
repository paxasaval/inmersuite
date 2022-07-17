import { RolService } from './../../service/rol.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, switchMap } from 'rxjs';
import { UserService } from '../../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AngularFireAuth,
    private rolService: RolService,
    private router: Router,
  ) {}

  canActivate(){
    if(this.auth.authState && localStorage.getItem('user') && localStorage.getItem('rol')){
      return this.rolService.getRolById(localStorage.getItem('rol')!).pipe(
        take(1),
        switchMap(async (rol)=>{
          if(rol.name==='administrador'||'profesor'){
            return true
          }else{
            this.router.navigate(['login'])
            return false
          }
        })
      )
    }else{
      this.router.navigate(['/login'])
      return false
    }

  }

}
