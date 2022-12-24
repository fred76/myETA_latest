import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }
  version : string = '1.0.0' 
  year : string = '2023' 
  emailstring= "mailto:app.user.info@icloud.com?Subject=ETA & ROB &body=Version: 1.0";

  ngOnInit(): void {
  }

}
