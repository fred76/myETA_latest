import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PortActivitiesComponent } from '../../port-activities/port-activities.component';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['../card.component.css']
})
export class OperationComponent implements OnInit {

  form: FormGroup

  duration: FormControl
  cargoOnBoardMT: FormControl
  laddenPercentage: FormControl
  ddggOne: FormControl
  ddggTwo: FormControl
  ddggThree: FormControl
  ddGGBunker: FormControl
  boilerOneFuel: FormControl
  boilerTwoFuel: FormControl
  boilerThreeFuel: FormControl
  boilerOnePercentage: FormControl
  boilerTwoPercentage: FormControl
  boilerThreePercentage: FormControl
  activityType: FormControl
  ETX: FormControl

  constructor(public dialogRef: MatDialogRef<PortActivitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.duration = new FormControl(data.duration, Validators.required)
    this.cargoOnBoardMT = new FormControl(data.cargoOnBoardMT, Validators.required)
    this.laddenPercentage = new FormControl(data.laddenPercentage, [
      Validators.min(0),
      Validators.max(100),
      Validators.required
    ])
    this.ddggOne = new FormControl(data.ddggOne, Validators.required);
    this.ddggTwo = new FormControl(data.ddggTwo, Validators.required);
    this.ddggThree = new FormControl(data.ddggThree, Validators.required);
    this.ddGGBunker = new FormControl(data.ddGGBunker, Validators.required);
    this.boilerOneFuel = new FormControl(data.boilerOneFuel, Validators.required), Validators.required;
    this.boilerTwoFuel = new FormControl(data.boilerTwoFuel, Validators.required), Validators.required;
    this.boilerThreeFuel = new FormControl(data.boilerThreeFuel, Validators.required), Validators.required;
    this.boilerOnePercentage = new FormControl(data.boilerOnePercentage, [
      Validators.min(0),
      Validators.max(100),
      Validators.required
    ])
    this.boilerTwoPercentage = new FormControl(data.boilerTwoPercentage, [
      Validators.min(0),
      Validators.max(100),
      Validators.required
    ])
    this.boilerThreePercentage = new FormControl(data.boilerThreePercentage, [
      Validators.min(0),
      Validators.max(100),
      Validators.required
    ])
    this.activityType = new FormControl(data.activityType, Validators.required);

    this.ETX = new FormControl('ETC');

    this.form = new FormGroup({
      duration: this.duration,
      cargoOnBoardMT: this.cargoOnBoardMT,
      laddenPercentage: this.laddenPercentage,
      ddggOne: this.ddggOne,
      ddggTwo: this.ddggTwo,
      ddggThree: this.ddggThree,
      ddGGBunker: this.ddGGBunker,
      boilerOneFuel: this.boilerOneFuel,
      boilerTwoFuel: this.boilerTwoFuel,
      boilerThreeFuel: this.boilerThreeFuel,
      boilerOnePercentage: this.boilerOnePercentage,
      boilerTwoPercentage: this.boilerTwoPercentage,
      boilerThreePercentage: this.boilerThreePercentage,
      activityType: this.activityType,
      ETX: this.ETX,
    })




  }


  ngOnInit(): void {
 
  }

}
