import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { Activity } from 'src/shared/schema/rotation.schema';
import { PortActivitiesComponent } from '../../port-activities/port-activities.component';
import { BehaviorSubject } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Agency } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-shifting',
  templateUrl: './shifting.component.html',
  styleUrls: ['../card.component.css']
})
export class ShiftingComponent implements OnInit {

   

  form: FormGroup
 
  berthOfActivity: FormControl
  duration: FormControl
  cargoOnBoardMT: FormControl
  laddenPercentage: FormControl
  mainEngineFuel: FormControl
  ddggOne: FormControl
  ddggTwo: FormControl
  ddggThree: FormControl
  // ddGGBunker: FormControl
  boilerOneFuel: FormControl
  boilerTwoFuel: FormControl
  boilerThreeFuel: FormControl 
  boilerOnePercentage: FormControl 
  boilerTwoPercentage: FormControl 
  boilerThreePercentage: FormControl 
  activityType: FormControl 
  ETX: FormControl 
  agencies: FormControl 


  agenciesPerLocation$ = new BehaviorSubject<Agency[] | null>(null);

  constructor(public dialogRef: MatDialogRef<PortActivitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private appservice: MyElectronService
  ) {
    this.appservice.getAgencByPortName(this.data.portName).then(p => {   
      this.agenciesPerLocation$.next(p)
    })
 
    
   if (data.activity !== undefined) {
  this.berthOfActivity = new FormControl(data.activity.berth )
  this.duration = new FormControl(data.activity.duration )
  this.cargoOnBoardMT = new FormControl(data.activity.cargoOnBoardMT )
  this.laddenPercentage = new FormControl(data.activity.laddenPercentage, [
    Validators.min(0),
    Validators.max(100),
    Validators.required
  ]) 
  this.mainEngineFuel = new FormControl(data.activity.mainEngineFuel )
  this.ddggOne = new FormControl(data.activity.ddggOne );
  this.ddggTwo = new FormControl(data.activity.ddggTwo );
  this.ddggThree = new FormControl(data.activity.ddggThree );
  // this.ddGGBunker = new FormControl(data.activity.ddGGBunker );
  this.boilerOneFuel = new FormControl(data.activity.boilerOneFuel )
  this.boilerTwoFuel = new FormControl(data.activity.boilerTwoFuel )
  this.boilerThreeFuel = new FormControl(data.activity.boilerThreeFuel ) 
   this.boilerOnePercentage = new FormControl(data.activity.boilerOnePercentage, [
      Validators.min(0),
      Validators.max(100) 
    ]) 
   this.boilerTwoPercentage = new FormControl(data.activity.boilerTwoPercentage, [
      Validators.min(0),
      Validators.max(100) 
    ]) 
   this.boilerThreePercentage = new FormControl(data.activity.boilerThreePercentage, [
      Validators.min(0),
      Validators.max(100) 
    ]) 
  } else {
    this.berthOfActivity = new FormControl(null)
  this.duration = new FormControl(null, Validators.required)
  this.cargoOnBoardMT = new FormControl(null )
  this.laddenPercentage = new FormControl(null, [
    Validators.min(0),
    Validators.max(100),
    Validators.required
  ]) 
  this.mainEngineFuel = new FormControl(null)
  this.ddggOne = new FormControl(null);
  this.ddggTwo = new FormControl(null);
  this.ddggThree = new FormControl(null);
  // this.ddGGBunker = new FormControl(null);
  this.boilerOneFuel = new FormControl(null)
  this.boilerTwoFuel = new FormControl(null)
  this.boilerThreeFuel = new FormControl(null) 
   this.boilerOnePercentage = new FormControl(null, [
      Validators.min(0),
      Validators.max(100) 
    ]) 
   this.boilerTwoPercentage = new FormControl(null, [
      Validators.min(0),
      Validators.max(100) 
    ]) 
   this.boilerThreePercentage = new FormControl(null, [
      Validators.min(0),
      Validators.max(100) 
    ]) 

  }
  this.activityType = new FormControl('Shifting');
  this.ETX = new FormControl('ETB');  
  this.agencies = new FormControl<Agency[] | null>(this.agenciesPerLocation$.getValue()!);

    

    this.form = new FormGroup({
      berthOfActivity: this.berthOfActivity, 
      duration : this.duration ,
      cargoOnBoardMT : this.cargoOnBoardMT ,
      laddenPercentage : this.laddenPercentage ,
      mainEngineFuel : this.mainEngineFuel ,
      ddggOne: this.ddggOne,
      ddggTwo: this.ddggTwo,
      ddggThree: this.ddggThree,
      // ddGGBunker: this.ddGGBunker,
      boilerOneFuel : this.boilerOneFuel ,
      boilerTwoFuel : this.boilerTwoFuel ,
      boilerThreeFuel : this.boilerThreeFuel , 
      boilerOnePercentage : this.boilerOnePercentage , 
      boilerTwoPercentage : this.boilerTwoPercentage , 
      boilerThreePercentage : this.boilerThreePercentage , 
      activityType : this.activityType , 
      ETX : this.ETX,  
      agency: this.agencies
    })

    
  }


  ngOnInit(): void {
    
  }

}
