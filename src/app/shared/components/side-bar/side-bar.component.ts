import { AuthService } from 'src/app/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { AuthCredential } from '@angular/fire/auth';
import { RolService } from 'src/app/service/rol.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  user=''
  rol=''
  constructor(
    private rolService: RolService,
    private auth: AuthService,
    private route: Router
    ) { }

  exit(){
  }

  ngOnInit(): void {
    this.user=localStorage.getItem('user')!
    if(this.rol=localStorage.getItem('rol')!){
      this.rolService.getRolById(this.rol).subscribe(
        result=>{
          this.rol=result.name!
        }
      )

  }

}
}
