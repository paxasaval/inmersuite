import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent implements OnInit {

  data:any

  constructor(
    private activatedroute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedroute.data.subscribe(data => {
      this.data=data;
  })
  }

}
