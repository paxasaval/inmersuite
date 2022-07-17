import { AdminComponent } from './admin.component';
import { LayerComponent } from './../../shared/components/layer/layer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LayerComponent,
    data: {rol: 'Administrador'},
    children:[
      {
        path:'home',
        component:AdminComponent
      },
      {
        path:'',
        pathMatch:'full',
        redirectTo: 'home'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
