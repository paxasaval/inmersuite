import { map, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { Answer, AnswerID } from '../models/answer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private answerCollecton:AngularFirestoreCollection<Answer>;
  answers:Observable<Answer[]>;

  constructor(
    private afs:AngularFirestore,
  ) {
    this.answerCollecton = afs.collection<Answer>('answer');
    this.answers = this.answerCollecton.valueChanges();
   }

  getAllAnswer(){
    return this.afs.collection<Answer>('answer').snapshotChanges().pipe(
      map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as AnswerID
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  getAnswerByTest(test:string){
    return this.afs.collection<Answer>('answer',ref=>ref.where('test','==',test)).snapshotChanges().pipe(
      map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as AnswerID
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  getAnswerByStudent(student:string){
    return this.afs.collection<Answer>('answer',ref=>ref.where('student','==',student)).snapshotChanges().pipe(
      map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as AnswerID
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  postAnswer(answer:Answer){
    const answerReferece = this.afs.collection<Answer>('answer').add(answer)
  }
}
