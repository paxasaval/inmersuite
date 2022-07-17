import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  observers: Subscription[]=[]


  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
  });


  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  get email(){
    return this.loginForm.get('email')
  }

  get password(){
    return this.loginForm.get('password')
  }

  submit(){
    if(!this.loginForm.valid){
      return
    }
    const {email, password} = this.loginForm.value;
    var obs = this.authService.login(email,password).pipe(
      this.toast.observe({
        success: 'Ha iniciado sesion con exito',
        loading: 'Iniciando sesion',
        error: 'Ha ocurrido un error al iniciar sesion, Intente mas tarde'
      })
    ).subscribe(()=>{
    });
    this.observers.push(obs)
  }
  signUp(){
    this.router.navigate(['login/signUp'])
  }
  ngOnDestroy(): void {
    this.observers.forEach(x=>{
      x.unsubscribe()
    })
  }
}
