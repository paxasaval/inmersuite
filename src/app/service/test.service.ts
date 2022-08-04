import { TestID } from './../models/test';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private afs:AngularFirestore
  ) { }
  getAllTest(){
    return this.afs.collection<Test>('test').snapshotChanges().pipe(
      map(actions => actions.map(a=>{
        const data = a.payload.doc.data() as TestID
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  getTestID(id:string){
    return this.afs.doc<Test>(`test/${id}`).snapshotChanges().pipe(
      map(a=>{
        const data = a.payload.data() as TestID
        data.id = a.payload.id
        return data
      })
    )
  }
  postTest(test:Test){
    const testReference = this.afs.collection<Test>('test').add(test)
  }
}
