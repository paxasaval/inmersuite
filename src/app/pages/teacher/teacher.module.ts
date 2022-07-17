import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherComponent } from './teacher.component';
import { RegisterLabComponent } from './components/register-lab/register-lab.component';


@NgModule({
  declarations: [
    TeacherComponent,
    RegisterLabComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
