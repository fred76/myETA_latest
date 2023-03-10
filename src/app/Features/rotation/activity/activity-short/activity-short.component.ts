import { Component, Input, OnInit } from '@angular/core';
import { Activity } from 'src/shared/schema/rotation.schema';

@Component({
  selector: 'app-activity-short',
  templateUrl: './activity-short.component.html',
  styleUrls: ['./activity-short.component.css']
})
export class ActivityShortComponent implements OnInit {

  constructor() { }

  @Input() indexActivity: number
  @Input() indexLocationActivityActivity: number
  @Input() activity: Activity

  ngOnInit(): void {
  }

}
