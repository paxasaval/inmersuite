import { SingUpComponent } from './pages/login/components/sign-up/sign-up.component';
import { SignInComponent } from './pages/login/components/sign-in/sign-in.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth/auth.guard';
import { TestComponent } from './pages/test/test.component';

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    redirectTo: 'login'
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'student',
    loadChildren: () => import('./pages/student/student.module').then(m => m.StudentModule),
  },
  {
    path: 'teacher',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/teacher/teacher.module').then(m => m.TeacherModule),
  },
  {
    path: 'login',
    component: LoginComponent,
    children:[
      {
        path:'',
        pathMatch:'full',
        redirectTo: 'signIn'
      },
      {
        path:'signIn',
        component: SignInComponent
      },
      {
        path:'signUp',
        component: SingUpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
