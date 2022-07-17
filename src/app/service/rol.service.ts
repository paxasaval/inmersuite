import { Observable, map } from 'rxjs';
import { Rol,RolID } from './../models/rol';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private rolCollection: AngularFirestoreCollection<Rol>;
 roles: Observable<Rol[]>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFirestore
  ) {
    this.rolCollection = afs.collection<Rol>('rol');
    this.roles = this.rolCollection.valueChanges();
   }

   getRolById(id: string){
    return this.afs.doc<Rol>(`rol/${id}`).snapshotChanges().pipe(
      map(a=>{
        const data = a.payload.data() as RolID
        data.id = a.payload.id
        return data
      })
    )
   }


   /* Permite actualziar el ojeto por uno nuevo con mas o menos informacion*/
   putRol(rol: any, id:string){
     const userReference = this.afs.doc<Rol>(`rol/${id}`)
     userReference.set(rol)
   }
}
