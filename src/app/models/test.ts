export interface Question{
  answer?:string,
  option_1?:string
  option_2?:string
  option_3?:string
  statement?:string
}
export interface Test{
  unity?:string,
  question_1?:Question,
  question_2?:Question,
  question_3?:Question,
  question_4?:Question,
  question_5?:Question,
}
export interface TestID extends Test{id:string}
