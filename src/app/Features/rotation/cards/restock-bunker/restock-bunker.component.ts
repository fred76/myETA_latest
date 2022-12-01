import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { PortActivitiesComponent } from '../../port-activities/port-activities.component';

@Component({
  selector: 'app-restock-bunker',
  templateUrl: './restock-bunker.component.html',
  styleUrls: ['../card.component.css']
})
export class RestockBunkerComponent implements OnInit {

  form: FormGroup 
  
  duration: FormControl 
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
  restockFo: FormControl 
  restockDo: FormControl 
  activityType: FormControl 
  ETX: FormControl
   
  constructor(public dialogRef: MatDialogRef<PortActivitiesComponent>,
    @Inject(MAT_DIALOG_DATA)  public data: any,
  ) {

    this.duration = new FormControl(data.duration, Validators.required); 
    this.ddggOne = new FormControl(data.ddggOne, Validators.required);
    this.ddggTwo = new FormControl(data.ddggTwo, Validators.required);
    this.ddggThree = new FormControl(data.ddggThree, Validators.required);
    this.ddGGBunker = new FormControl(data.ddGGBunker, Validators.required);
    this.boilerOneFuel = new FormControl(data.boilerOneFuel, Validators.required)
    this.boilerTwoFuel = new FormControl(data.boilerTwoFuel, Validators.required)
    this.boilerThreeFuel = new FormControl(data.boilerThreeFuel, Validators.required) 
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
    this.restockFo = new FormControl(data.restockFo, Validators.required) 
    this.restockDo = new FormControl(data.restockDo, Validators.required) 
    this.activityType = new FormControl('Bunkering')
    this.ETX = new FormControl('ETC')

    this.form = new FormGroup({
      duration: this.duration,
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
      restockFo: this.restockFo,
      restockDo: this.restockDo,
      ETX: this.ETX,
      activityType: this.activityType
    })
 
  }


  ngOnInit(): void {
  }

}
