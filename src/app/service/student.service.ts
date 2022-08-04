import { map } from 'rxjs';
import { Student, StudentID } from './../models/student';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private afs: AngularFirestore) {
  }

  getAllStudents(){
    return this.afs.collection<Student>('student').snapshotChanges().pipe(
      map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as StudentID
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  getStudentByID(id:string){
    return this.afs.doc<Student>(`student/${id}`).snapshotChanges().pipe(
      map(a=>{
        const data =a.payload.data() as StudentID
        data.id = a.payload.id
        return data
      })
    )
  }

}
