import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, retry } from 'rxjs';
import { User, UserId } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFirestore
  ) {
    this.userCollection = afs.collection<User>('user');
    this.users = this.userCollection.valueChanges();
   }

   getUserById(id: string){
    return this.afs.doc<User>(`user/${id}`).snapshotChanges().pipe(
      map(a=>{
        const data = a.payload.data() as UserId
        data.id = a.payload.id
        return data
      })
    )
   }

   postUser(user: User){
     const userReference = this.afs.doc<User>(`user/${user.mail}`)
     userReference.set(user)
   }

}
