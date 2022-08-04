import { Timestamp } from "@angular/fire/firestore";

export interface Answer {
  student?: string,
  test?:string,
  start?: Timestamp,
  end?: Timestamp,
  question_1?: string,
  question_2?: string,
  question_3?: string,
  question_4?: string,
  question_5?: string,
}
export interface AnswerID extends Answer{id:string}
