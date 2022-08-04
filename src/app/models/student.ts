export interface Student{
  name?:string,
  lastName?:string,
  mail?:string,
  teacher?:string
}
export interface StudentID extends Student{id:string}
