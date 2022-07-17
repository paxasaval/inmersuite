import { Router } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, Validators, FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

export function passwordMatchValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null =>{
    const password = control.get('password')?.value;
    const confirmmedPassword = control.get('confimPassword')?.value;
    if(password && confirmmedPassword && password !== confirmmedPassword){
      return {passwordsDontMatch: true};
    }else{
      return null;
    }
  };
}

@Component({
  selector: 'app-sing-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SingUpComponent implements OnInit {

  singUpForm = new FormGroup(
    {
      name: new FormControl('',Validators.required),
      rol: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',Validators.required),
      confirmPassword: new FormControl('',Validators.required)
    },
    {validators: passwordMatchValidator()}
  )

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
  }

  get name() {
    return this.singUpForm.get('name');
  }

  get email(){
    return this.singUpForm.get('email')
  }

  get rol(){
    return this.singUpForm.get('rol')
  }

  get password(){
    return this.singUpForm.get('password')
  }

  get confirmPassword() {
    return this.singUpForm.get('confirmPassword');
  }

  submit(){
    if(!this.singUpForm.valid){
      return;
    }

    const {name, rol, email, password} = this.singUpForm.value;
    this.authService.signUp(name, email, password,rol).pipe(
      this.toast.observe({
        success: 'Felicidades! Se ha registrado con exito',
        loading: 'Registrando...',
        error: ({ message }) => `${message}`
      })
    ).subscribe(result=>{
      console.log(result)
      this.router.navigate([''])
    })
  }



}
