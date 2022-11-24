import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivityModel } from 'src/shared/entity/rotation-model';
import { PortActivitiesComponent } from '../../port-activities/port-activities.component';

@Component({
  selector: 'app-canal-transit',
  templateUrl: './canal-transit.component.html',
  styleUrls: ['../card.component.css']
})
export class CanalTransitComponent implements OnInit {

  form: FormGroup

   
  duration: FormControl
  cargoOnBoardMT: FormControl
  laddenPercentage: FormControl
  foExtimatecConsumption: FormControl
  doExtimatecConsumption: FormControl
  ETX: FormControl
  activityType: FormControl
 
  constructor(public dialogRef: MatDialogRef<PortActivitiesComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: any,
  ) {

  this.duration = new FormControl(data.duration, Validators.required)
  this.cargoOnBoardMT = new FormControl(data.cargoOnBoardMT, Validators.required)
  this.laddenPercentage = new FormControl(data.laddenPercentage, [
    Validators.min(0),
    Validators.max(100),
    Validators.required
  ]) 
  this.foExtimatecConsumption = new FormControl(data.foExtimatecConsumption, Validators.required)
  this.doExtimatecConsumption = new FormControl(data.doExtimatecConsumption, Validators.required)
  this.ETX = new FormControl('ETC');
  this.activityType = new FormControl('Canal Transit');

    this.form = new FormGroup({ 
      duration: this.duration,
      cargoOnBoardMT: this.cargoOnBoardMT,
      laddenPercentage: this.laddenPercentage,
      foExtimatecConsumption: this.foExtimatecConsumption,
      doExtimatecConsumption: this.doExtimatecConsumption,
      ETX: this.ETX,
      activityType: this.activityType
    })


  }


  ngOnInit(): void {
  }

}
