import { LayerComponent } from './../../shared/components/layer/layer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherComponent } from './teacher.component';

const routes: Routes = [
  {
    path:'',
    component:LayerComponent,
    data: [{rol: 'profesor'}],
    children:[
      {
        path:'home',
        component:TeacherComponent
      },
      {
        path:'',
        pathMatch:'full',
        redirectTo:'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
