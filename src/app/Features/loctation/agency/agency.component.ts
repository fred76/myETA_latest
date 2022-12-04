import { Component, Input, OnInit } from '@angular/core';
import { Port } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['../details.component.css']
})
export class AgencyComponent implements OnInit {

  constructor() { }

  @Input() port: Port

  ngOnInit(): void {
  }

}
