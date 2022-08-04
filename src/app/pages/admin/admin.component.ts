import { FormControl } from '@angular/forms';
import { AnswerID } from './../../models/answer';
import { StudentID } from './../../models/student';
import { Question, TestID } from './../../models/test';
import { TestService } from 'src/app/service/test.service';
import { StudentService } from './../../service/student.service';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective, ThemeService } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { Test } from 'src/app/models/test';
import { AnswerService } from 'src/app/service/answer.service';
import { combineLatest, forkJoin, from, iif, of } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material/core';
import * as moment from 'moment';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';

export interface AnswerAux extends AnswerID {
  puntaje?:number[]
  unity?:string
  nota: number,
  time?: number
}

export interface StudentAux extends StudentID{
  average?:number
  done?:number
  missing?:number
}

export interface studenTable{
  mail?:string,
  unity1?:number[]
  unity2?:number[]
  unity3?:number[]
}

function ordenarPorBurbuja(arrayDesordenado: TestID[]): TestID[] {
  // Copia el array recibido
  let tempArray: TestID[] = arrayDesordenado;
  let volverAOrdenar: boolean = false
  // Recorre el array
  tempArray.forEach(function (valor, key) {
    // Comprueba si el primero es mayor que el segundo y no esta en la última posición
    if (tempArray[key].unity! > tempArray[key + 1]?.unity! && tempArray.length - 1 != key) {
      // Intercambia la primera posición por la segunda
      let primerNum: TestID = tempArray[key]
      let segundoNum: TestID = tempArray[key + 1]
      tempArray[key] = segundoNum
      tempArray[key + 1] = primerNum
      // Si debe volver a ordenarlo
      volverAOrdenar = true
    }
  })
  // Vuelve a llamar al función
  if (volverAOrdenar) {
    ordenarPorBurbuja(tempArray)
  }
  // Array ordenado
  return tempArray
}

function ordenarPorBurbujaStudentAux(arrayDesordenado: StudentAux[]): StudentAux[] {
  // Copia el array recibido
  let tempArray: StudentAux[] = arrayDesordenado;
  let volverAOrdenar: boolean = false
  // Recorre el array
  tempArray.forEach(function (valor, key) {
    // Comprueba si el primero es mayor que el segundo y no esta en la última posición
    if (tempArray[key].average! > tempArray[key + 1]?.average! && tempArray.length - 1 != key) {
      // Intercambia la primera posición por la segunda
      let primerNum: TestID = tempArray[key]
      let segundoNum: TestID = tempArray[key + 1]
      tempArray[key] = segundoNum
      tempArray[key + 1] = primerNum
      // Si debe volver a ordenarlo
      volverAOrdenar = true
    }
  })
  // Vuelve a llamar al función
  if (volverAOrdenar) {
    ordenarPorBurbuja(tempArray)
  }
  // Array ordenado
  return tempArray
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  total_answer: number = 0
  allTest: TestID[] = []
  total_test: number = 0
  allStudent: StudentID[] = []
  allStudentAux: StudentAux[] =[]
  allAnswer: AnswerID[] = []
  auxAnswer: any[] = []
  auxTest: TestID[] = []
  auxStudent: any[] = []
  answerQualify: any[] = []
  averageQualify: number[] = []
  average_general: number = 0
  average_times: number[] = []
  //table
  dataTabe:studenTable[]=[]
  displayedColumns=['mail','P1.1','P1.2','P1.3','P1.4','P1.5','P2.1','P2.2','P2.3','P2.4','P2.5','P3.1','P3.2','P3.3','P3.4','P3.5']
  //
  load_pie = false
  load_bar = false
  load_pie2 = false
  load_pie3 = false
  load_pie4 = false
  load_pie5 = false
  load_pie6 = false
  load_pie7 = false
  load_pie8 = false
  load_pie9 = false
  load_line = false
  load_question = false
  load_student = false
  //
  selected = 1
  selectedQuiz = new FormControl()

  selectedUnity1 = new FormControl()
  auxUnitySelected!: TestID
  selectedQuestion1 = new FormControl({ value: '', disabled: true })
  auxQuestion!: Question[]
  auxQuestionSelected!: Question
  selectedStudent1 = new FormControl({ value: '', disabled: false })
  auxStudents!: StudentID[]
  auxStudentSelected!: StudentID
  //color pallete
  colors1=[
    '#ede6db',
    '#284B63',
    '#a2b38b',
    '#3C6E71',
    '#8fbdd3',
  ].reverse()
  colors2=[
    '#94a5b1',
    '#698192',
    '#48667a',
    '#284b63',
    '#24445b',
    '#1e3b51',
    '#183347',
    '#0f2335'
  ]
  //
  selectedUnity: string = ""
  avg_time_unity: number = 0
  q1: string = ''
  q2: string = ''
  q3: string = ''
  q4: string = ''
  q5: string = ''
  //USER
  rol!:string
  userName!:string
  constructor(private studentService: StudentService,
    private testService: TestService,
    private answerService: AnswerService,
    private userService: UserService,
    private authService: AuthService
    ) {
  }
  //line
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: '',
        backgroundColor:this.colors1,
        borderColor:this.colors1,
        pointBorderColor:this.colors2[3],
         pointBackgroundColor:this.colors2[3]
      },
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
    },

    plugins: {
      legend: { display: true },
    }
  };
  //end-line
  public lineChartType: ChartType = 'line';
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    },
  };
  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType: ChartType = 'doughnut';
  //end-pie
  //bar
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Tiempo promedio (min)' },
    ]
  };
  //end-bar
  // Pie2
  public pieChartOptions2: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,

      }
    }
  };
  public pieChartData2: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType2: ChartType = 'doughnut';
  //end-pie2
  // Pie3
  public pieChartOptions3: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData3: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType3: ChartType = 'doughnut';
  //end-pie3
  // Pie4
  public pieChartOptions4: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData4: ChartData<'doughnut', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType4: ChartType = 'doughnut';

  //end-pie4
  // Pie5
  public pieChartOptions5: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData5: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType5: ChartType = 'pie';

  //end-pie5
  // Pie6
  public pieChartOptions6: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData6: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType6: ChartType = 'pie';
  public pieChartPlugins6 = [DatalabelsPlugin];
  //end-pie6
  // Pie7
  public pieChartOptions7: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData7: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType7: ChartType = 'pie';

  //end-pie7
  // Pie8
  public pieChartOptions8: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData8: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType8: ChartType = 'pie';

  //end-pie8
  // Pie9
  public pieChartOptions9: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      }
    }
  };
  public pieChartData9: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: []
    }]
  };
  public pieChartType9: ChartType = 'pie';

  //end-pie9
  public HbarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: { max: 6 },
      y: {

      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public HbarChartType: ChartType = 'bar';

  public HbarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: '' },
    ]
  };
  //end-bar
  //radar
  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        min:0,
        max:5,
        ticks:{
          stepSize:1
        },
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        borderColor: this.colors2[0]
      },
      point:{

      }
    },
    plugins:{
      tooltip: {
        enabled: true
      }
    }
  };
  public radarChartType: ChartType = 'radar';


  public radarChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      { data: [], label: '', pointBorderColor:this.colors2[3], pointBackgroundColor:this.colors2[3]}
    ]
  };
  //end-radar
  //end variables

  fetchAllTest() {
    this.testService.getAllTest().subscribe(
      res => {
        this.allTest = res
      }
    )
  }
  fetchAllStudent() {
    this.studentService.getAllStudents().subscribe(
      res => {
        this.allStudent = res

      }
    )
  }
  fetchhAllAnswer() {
    this.answerService.getAllAnswer().subscribe(
      res => {
        this.allAnswer = res
      }
    )
  }
  fetchPieData() {
    this.pieChartData.labels = []
    this.pieChartData.datasets[0].data = []
    this.pieChartData.labels?.push('Completadas')
    this.pieChartData.labels?.push('Sin Completar')
    this.pieChartData.datasets[0].data.push(this.allAnswer.length)
    let max = this.allStudent.length * this.allTest.length
    this.pieChartData.datasets[0].data.push(max - this.allAnswer.length)
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.pieChartData.datasets[0].backgroundColor=this.colors1
    this.load_pie = true
  }
  filterData() {
    this.auxAnswer = []
    this.auxStudent = []
    this.auxTest = []
    for (let i = 1; i < this.allTest.length + 1; i++) {
      this.allTest.every(test => {
        if (test.unity === i.toString()) {
          this.auxTest.push(test)
          let aux: AnswerID[] = []
          this.auxAnswer.push(aux)
          return false
        }
        return true
      })
    }
    for (let i = 0; i < this.allStudent.length; i++) {
      let aux: AnswerID[] = []
      this.auxStudent.push(aux)
    }

    this.allAnswer.forEach(answer => {
      for (let i = 0; i < this.auxTest.length; i++) {
        if (this.auxTest[i].id == answer.test) {
          this.auxAnswer[i].push(answer)
          break
        }
      }
      for (let i = 0; i < this.allStudent.length; i++) {
        if (answer.student == this.allStudent[i].mail) {
          this.auxStudent[i].push(answer)
          break
        }
      }
    })
    //console.log(this.auxStudent)
    //console.log(this.auxAnswer)
  }
  fetchPie2() {
    this.pieChartData2.labels = []
    this.pieChartData2.datasets[0].data = []
    this.pieChartData2.labels?.push('Completadas')
    this.pieChartData2.labels?.push('Sin Completar')
    this.pieChartData2.datasets[0].data.push(this.auxAnswer[0].length)
    let max = this.allStudent.length
    this.pieChartData2.datasets[0].data.push(max - this.auxAnswer[0].length)
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.pieChartData2.datasets[0].backgroundColor=this.colors1
    this.load_pie2 = true
  }
  fetchPie3() {
    this.pieChartData3.labels = []
    this.pieChartData3.datasets[0].data = []
    this.pieChartData3.labels?.push('Completadas')
    this.pieChartData3.labels?.push('Sin Completar')
    this.pieChartData3.datasets[0].data.push(this.auxAnswer[1].length)
    let max = this.allStudent.length
    this.pieChartData3.datasets[0].data.push(max - this.auxAnswer[1].length)
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.pieChartData3.datasets[0].backgroundColor=this.colors1

    this.load_pie3 = true
  }
  fetchPie4() {
    this.pieChartData4.labels = []
    this.pieChartData4.datasets[0].data = []
    this.pieChartData4.labels?.push('Completadas')
    this.pieChartData4.labels?.push('Sin Completar')
    this.pieChartData4.datasets[0].data.push(this.auxAnswer[2].length)
    let max = this.allStudent.length
    this.pieChartData4.datasets[0].data.push(max - this.auxAnswer[2].length)
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.pieChartData4.datasets[0].backgroundColor=this.colors1

    this.load_pie4 = true
  }
  fetchPie5(labels: string[], data: any[]) {
    this.pieChartData5.labels = labels
    this.pieChartData5.datasets[0].data.push(this.auxAnswer[2].length)
    let max = this.allStudent.length
    this.pieChartData5.datasets[0].data.push(max - this.auxAnswer[2].length)
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.load_pie4 = true
    this.pieChartData5.datasets[0].backgroundColor=this.colors1

  }
  qualifyAnswer() {
    this.answerQualify = []
    for (let i = 0; i < this.auxAnswer.length; i++) {
      let auxArray: AnswerAux[] = []
      this.answerQualify.push(auxArray)

      this.auxAnswer[i].forEach((answer: AnswerID) => {
        let qualify: number = 0
        let test = this.auxTest[i]
        let puntaje:number[]=[0,0,0,0,0]
        if (answer.question_1 === test.question_1?.answer) {
          qualify += 1
          puntaje[0]=1
        }
        if (answer.question_2 === test.question_2?.answer) {
          qualify += 1
          puntaje[1]=1
        }
        if (answer.question_3 === test.question_3?.answer) {
          qualify += 1
          puntaje[2]=1
        }
        if (answer.question_4 === test.question_4?.answer) {
          qualify += 1
          puntaje[3]=1
        }
        if (answer.question_5 === test.question_5?.answer) {
          qualify += 1
          puntaje[4]=1
        }
        let start = moment(answer.start?.toDate())
        let end = moment(answer.end?.toDate())
        let time = end.diff(start, 'minute')
        let aux: AnswerAux = { ...answer, nota: qualify, time: time,puntaje:puntaje,unity:test.unity }
        this.answerQualify[i].push(aux)
      })
    }
    console.log(this.answerQualify)
    this.qualifStudent()
  }

  averageQualfyTest() {
    this.averageQualify = []
    this.average_times = []
    this.answerQualify.forEach((answerQualifyTest: AnswerAux[]) => {
      let average: number = 0
      let average_time: number = 0
      let lim: number = answerQualifyTest.length
      answerQualifyTest.forEach(testQualify => {
        average += testQualify.nota
        average_time += testQualify.time!
      })
      average = average / lim
      average_time = Math.round(average_time / lim)
      this.averageQualify.push(average)
      this.average_times.push(average_time)
    })
    let aux_t: number = 0
    this.averageQualify.forEach(average => {
      aux_t += average
    })
    this.average_general = aux_t / this.averageQualify.length
  }
  fetchBar() {
    this.load_bar = false
    this.barChartData.labels = []
    this.allTest.forEach(test => {
      this.barChartData.labels?.push(`Unidad ${test.unity}`)
      const i = this.allTest.indexOf(test)
      this.barChartData.datasets[0].data.push(this.average_times[i])
    })
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.barChartData.datasets[0].backgroundColor=this.colors1

    this.load_bar = true
  }
  fetchLine(labels: string[], data: number[]) {
    this.load_line = false
    this.lineChartData.labels = labels
    this.lineChartData.datasets[0].data = data
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.lineChartData.datasets[0].backgroundColor=this.colors1
    this.load_student = false
    this.load_question = false
    this.load_line = true
  }
  fetcHBar(labels: string[], data: number[], question: string) {
    this.load_question = false
    this.HbarChartData.labels = labels
    this.HbarChartData.datasets[0].data = data
    this.HbarChartData.datasets[0].label = question
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.HbarChartData.datasets[0].backgroundColor=this.colors1
    this.load_line = false
    this.load_student = false
    this.load_question = true
  }
  fetchRadar(labels: string[], data: number[]) {
    //console.log(labels)
    //console.log(data)
    this.load_student = false
    this.radarChartData.labels = labels
    this.radarChartData.datasets[0].data = data
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.radarChartData.datasets[0].backgroundColor=this.colors1
    this.load_line = false
    this.load_question = false
    this.load_student = true
  }
  fetchSummaryTest(x: number) {
    let label1: string[] = []
    let label2: string[] = []
    let label3: string[] = []
    let label4: string[] = []
    let label5: string[] = []
    let data1: number[] = []
    let data2: number[] = []
    let data3: number[] = []
    let data4: number[] = []
    let data5: number[] = []
    let auxTime: number = 0
    //
    this.selectedUnity = this.allTest[x].unity!
    //
    label1.push(this.allTest[x].question_1?.option_1!)
    label1.push(this.allTest[x].question_1?.option_2!)
    label1.push(this.allTest[x].question_1?.option_3!)
    data1.push(0)
    data1.push(0)
    data1.push(0)
    this.q1 = this.allTest[x].question_1?.statement!
    //
    label2.push(this.allTest[x].question_2?.option_1!)
    label2.push(this.allTest[x].question_2?.option_2!)
    label2.push(this.allTest[x].question_2?.option_3!)
    data2.push(0)
    data2.push(0)
    data2.push(0)
    this.q2 = this.allTest[x].question_2?.statement!
    //
    label3.push(this.allTest[x].question_3?.option_1!)
    label3.push(this.allTest[x].question_3?.option_2!)
    label3.push(this.allTest[x].question_3?.option_3!)
    data3.push(0)
    data3.push(0)
    data3.push(0)
    this.q3 = this.allTest[x].question_3?.statement!
    //
    label4.push(this.allTest[x].question_4?.option_1!)
    label4.push(this.allTest[x].question_4?.option_2!)
    label4.push(this.allTest[x].question_4?.option_3!)
    data4.push(0)
    data4.push(0)
    data4.push(0)
    this.q4 = this.allTest[x].question_4?.statement!
    //
    label5.push(this.allTest[x].question_5?.option_1!)
    label5.push(this.allTest[x].question_5?.option_2!)
    label5.push(this.allTest[x].question_5?.option_3!)
    data5.push(0)
    data5.push(0)
    data5.push(0)
    this.q5 = this.allTest[x].question_5?.statement!
    this.answerQualify[x].forEach((answer: AnswerAux) => {
      data1[parseInt(answer.question_1!) - 1] += 1
      data2[parseInt(answer.question_2!) - 1] += 1
      data3[parseInt(answer.question_3!) - 1] += 1
      data4[parseInt(answer.question_4!) - 1] += 1
      data5[parseInt(answer.question_5!) - 1] += 1
      auxTime += answer.time!
    });
    this.avg_time_unity = auxTime / this.answerQualify[x].length
    //console.log(this.answerQualify[x].length)
    this.pieChartData5.labels = label1
    this.pieChartData5.datasets[0].data = data1
    this.pieChartData5.datasets[0].backgroundColor=this.colors1
    //
    this.pieChartData6.labels = label2
    this.pieChartData6.datasets[0].data = data2
    this.pieChartData6.datasets[0].backgroundColor=this.colors1

    //
    this.pieChartData7.labels = label3
    this.pieChartData7.datasets[0].data = data3
    this.pieChartData7.datasets[0].backgroundColor=this.colors1

    //
    this.pieChartData8.labels = label4
    this.pieChartData8.datasets[0].data = data4
    this.pieChartData8.datasets[0].backgroundColor=this.colors1

    //
    this.pieChartData9.labels = label5
    this.pieChartData9.datasets[0].data = data5
    this.pieChartData9.datasets[0].backgroundColor=this.colors1

    this.charts.forEach(chart => {
      chart?.update();
    })
    this.load_pie5 = true
    this.load_pie6 = true
    this.load_pie7 = true
    this.load_pie8 = true
    this.load_pie9 = true
  }
  changeSumary(value: any) {
    //console.log(value)
    this.fetchSummaryTest(value)
  }
  changeUnit(value: any) {
    this.auxQuestion = []
    let test = this.allTest[value]
    this.auxQuestion.push(test.question_1!)
    this.auxQuestion.push(test.question_2!)
    this.auxQuestion.push(test.question_3!)
    this.auxQuestion.push(test.question_4!)
    this.auxQuestion.push(test.question_5!)
    //
    let label: string[] = []
    let data: number[] = []
    this.answerQualify[value].forEach((answer: AnswerAux) => {
      label.push(answer.student!)
      data.push(answer.nota)
    });
    this.fetchLine(label, data)

    this.selectedQuestion1.enable()
  }
  changeQuestion(value: Question) {
    let label: string[] = []
    let data: number[] = []
    //console.log(value)
    label.push(value.option_1!)
    data.push(0)
    label.push(value.option_2!)
    data.push(0)
    label.push(value.option_3!)
    data.push(0)
    let i = this.selectedUnity1.value
    let test = this.allTest[i]
    let x!: number
    if (test.question_1?.statement == value.statement) {
      x = 1
    }
    if (test.question_2?.statement == value.statement) {
      x = 2
    }
    if (test.question_3?.statement == value.statement) {
      x = 3
    }
    if (test.question_4?.statement == value.statement) {
      x = 4
    }
    if (test.question_5?.statement == value.statement) {
      x = 5
    }
    this.answerQualify[i].forEach((answer: AnswerAux) => {
      switch (x) {
        case 1:
          data[parseInt(answer.question_1!) - 1] += 1
          break;
        case 2:
          data[parseInt(answer.question_1!) - 1] += 1
          break;
        case 3:
          data[parseInt(answer.question_1!) - 1] += 1
          break;
        case 4:
          data[parseInt(answer.question_1!) - 1] += 1
          break;
        case 5:
          data[parseInt(answer.question_1!) - 1] += 1
          break;
        default:
          break;
      }
    });
    this.fetcHBar(label, data, value.statement!)
  }
  changeStudent(value: string) {
    let label: string[] = []
    let data: number[] = []
    this.allTest.forEach(test => {
      label.push('Unidad ' + test.unity)
    })
    for (let i = 0; i < this.answerQualify.length; i++) {
      const isStudent = (element: AnswerAux) => (element.student) == (value)
      const j = this.answerQualify[i].findIndex(isStudent)
      if(j==-1){
        data.push(0)
      }else{
      //console.log(this.answerQualify[i][j])
      data.push(this.answerQualify[i][j].nota)
      }
    }
    this.fetchRadar(label, data)
  }
  fetchPiesTestSummary() {
    this.fetchPie2()
    this.fetchPie3()
    this.fetchPie4()
  }
  fetchData() {
    const testObserver = this.testService.getAllTest()
    const studentObserver = this.studentService.getAllStudents()
    const answerObserver = this.answerService.getAllAnswer()
    const observable = combineLatest([testObserver, studentObserver, answerObserver]).subscribe(
      ([test, student, answer]) => {
        this.allTest = ordenarPorBurbuja(test)
        this.allStudent = student
        this.allAnswer = answer
        this.filterData()
        this.qualifyAnswer()
        this.averageQualfyTest()
        this.fetchPieData()
        this.fetchBar()
        this.fetchPiesTestSummary()
        if (!this.selectedQuiz.value) {
          this.selectedQuiz.setValue(0)
          this.fetchSummaryTest(0)
        }
        if (!this.selectedUnity1.value) {
          let labels: string[] = []
          let data: number[] = []
          this.allTest.forEach(test => {
            labels.push('Unidad ' + test.unity)
          })
          this.averageQualify.forEach(avg => {
            data.push(avg)
          })
          this.fetchLine(labels, data)
        }
      }
    )
  }
  qualifStudent(){
    let auxStudent:any[]=[]
    let outStudents:StudentAux[]=[]
    let outTable:studenTable[]=[]
    this.allStudent.forEach(student=>{
      auxStudent.push([])
    })
    this.answerQualify.forEach((arraAnswer:AnswerAux[])=>{
      arraAnswer.forEach(answer=>{
        const isAnswerByStudent = (element:StudentID)=>(element.mail)==(answer.student)
        const i_student = this.allStudent.findIndex(isAnswerByStudent)
        if(i_student!=-1){
          auxStudent[i_student].push(answer)
        }
        })
    })
    for (let i = 0; i < auxStudent.length; i++) {
      let average:number=0
      let total:number=0
      let studentTable:studenTable={mail:this.allStudent[i].mail,unity1:[0,0,0,0,0],unity2:[0,0,0,0,0],unity3:[0,0,0,0,0]}
      auxStudent[i].forEach((answer:AnswerAux)=>{
        total+=answer.nota
        if(answer.unity==='1'){
          studentTable.unity1=answer.puntaje
        }
        if(answer.unity==='2'){
          studentTable.unity2=answer.puntaje
        }
        if(answer.unity==='3'){
          studentTable.unity3=answer.puntaje
        }
      })
      let lim = auxStudent[i].length
      average=total/lim
      outStudents.push({
        ...this.allStudent[i],
        average:average,
        done:lim,
        missing:this.allTest.length-lim
      })
      outTable.push(studentTable)
    }
    this.allStudentAux=ordenarPorBurbujaStudentAux(outStudents).reverse()
    this.dataTabe=outTable
  }
  fetchTable(){
    let outTable:studenTable[]=[]

  }
  exit(){
    localStorage.clear()
    this.authService.logout()
  }

  ngOnInit(): void {
    this.fetchData()
    let user = localStorage.getItem('user')
    this.userService.getUserById(user!).subscribe(
      user=>{
        this.userName=user.name!
        this.rol=user.rol!
      }
    )

  }
  ngAfterViewInit() {

  }
}
