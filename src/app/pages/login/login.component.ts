import { RolService } from './../../service/rol.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  observers: Subscription[]=[]

  constructor(
    private router: Router,
    private rolService: RolService

  ) {

  }

  ngOnInit(): void {
    if(localStorage.getItem('rol')){
      this.rolService.getRolById(localStorage.getItem('rol')!).subscribe(
        result=>{
          var rol = result.name
          if(rol==='administrador'){
            this.router.navigate(['admin'])
          }
          if(rol==='estudiante'){
            this.router.navigate(['student'])
          }
          if(rol==='profesor'){
            this.router.navigate(['teacher'])
          }
        }
      )
    }
  }
  ngOnDestroy(): void {
    this.observers.forEach(x=>{
      x.unsubscribe()
    })
  }

}
