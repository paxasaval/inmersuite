import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { from, map, Observable, switchMap, take } from 'rxjs';
import { User, UserId } from 'src/app/models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private userSerevice: UserService,
    private authorize: AngularFireAuth,
    private router: Router) {
  }

  signUp(name: string, email: string, password: string, rol: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(({ user }) =>
        updateProfile(user, { displayName: name }).then(() => {
          var newUser: User = {}
          newUser.mail = email
          newUser.name = name
          newUser.rol = rol
          newUser.uid = user.uid
          this.userSerevice.postUser(newUser)
        })
      ),
    );
  }

  login(email: string, password: string): Observable<any> {
    this.userSerevice.getUserById(email).subscribe(
      user => {
        localStorage.setItem('user', user.id)
        localStorage.setItem('rol', user.rol!)
        if (user.rol === '8OtdlHvZm3QweJO54N68') {
          this.router.navigate(['admin'])
        }
        if (user.rol === 'r479OgThpJLPGXsOryCW') {
          this.router.navigate(['student'])
        }
        if (user.rol === 'TeYbplZwhuz1NZfH03G1') {
          this.router.navigate(['teacher'])
        }
      }
    )
    return from(signInWithEmailAndPassword(this.auth, email, password))
  }

  logout(): Observable<any> {
    console.log('salio')
    localStorage.clear();
    return from(this.auth.signOut())
  }

  whoLogged() {

  }



}
