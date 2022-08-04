import { Answer } from './../../models/answer';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { AnswerService } from 'src/app/service/answer.service';
import { Question, Test } from 'src/app/models/test';
import { TestService } from 'src/app/service/test.service';
export function addHours(numOfHours:number, date:Date) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}
export function getRandomInt(max:number) {
  return Math.floor(Math.random()* max)+1;
}
export function getRandom(max:number) {
  return (Math.random()* max)+1;
}
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private answerService:AnswerService,
    private testService:TestService
    ) { }
  uploadData(lim:number){
    const test1:string ='1guOaMGSBZwWzqCjeHDb'
    const date:Date=new Date()
    let uploadArray:Answer[]=[]
    for (let i = 0; i < lim; i++) {
      let auxStart=addHours(getRandomInt(12),date)
      let ax1 = Timestamp.fromDate(auxStart)
      let auxEnd=addHours(getRandom(2),auxStart)
      let ax2= Timestamp.fromDate(auxEnd)
      let aux:Answer={
        student:`student${i+1}@test.com`,
        test:test1,
        start: ax1,
        end: ax2,
        question_1:getRandomInt(3).toString(),
        question_2:getRandomInt(3).toString(),
        question_3:getRandomInt(3).toString(),
        question_4:getRandomInt(3).toString(),
        question_5:getRandomInt(3).toString(),
      }
      uploadArray.push(aux)
    }
    uploadArray.forEach(upload=>{
      console.log(upload)
      this.answerService.postAnswer(upload)

    })
  }

  uploadData2(){
    let test2:Test={
      unity:'2'
    }
    let questions1:Question[]=[]
    for (let i = 0; i < 5; i++) {
      let q_aux:Question={
        statement:`Pregunta ${i+1}`,
        answer:getRandomInt(3).toString(),
        option_1:'Opcion 1',
        option_2:'Opcion 2',
        option_3:'Opcion 3',
      }
      questions1.push(q_aux)
    }
    test2.question_1=questions1[0]
    test2.question_2=questions1[1]
    test2.question_3=questions1[2]
    test2.question_4=questions1[3]
    test2.question_5=questions1[4]
    let test3:Test={
      unity:'3'
    }
    let questions2:Question[]=[]
    for (let i = 0; i < 5; i++) {
      let q_aux:Question={
        statement:`Pregunta ${i+1}`,
        answer:getRandomInt(3).toString(),
        option_1:'Opcion 1',
        option_2:'Opcion 2',
        option_3:'Opcion 3',
      }
      questions2.push(q_aux)
    }
    test3.question_1=questions2[0]
    test3.question_2=questions2[1]
    test3.question_3=questions2[2]
    test3.question_4=questions2[3]
    test3.question_5=questions2[4]
    console.log(test2)
    console.log(test3)
    this.testService.postTest(test2)
    this.testService.postTest(test3)
  }

  ngOnInit(): void {
    //this.uploadData(5)
    //this.uploadData2()
  }

}
