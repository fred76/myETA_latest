import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { PortActivitiesComponent } from '../../port-activities/port-activities.component';
import { BehaviorSubject } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Agency } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-layby-berth',
  templateUrl: './layby-berth.component.html',
  styleUrls: ['../card.component.css']
})
export class LaybyBerthComponent implements OnInit {

  form: FormGroup
  duration: FormControl
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
  

    this.duration = new FormControl(data.duration, Validators.required);
    this.ddggOne = new FormControl(data.ddggOne);
    this.ddggTwo = new FormControl(data.ddggTwo);
    this.ddggThree = new FormControl(data.ddggThree);
    // this.ddGGBunker = new FormControl(data.ddGGBunker);
    this.boilerOneFuel = new FormControl(data.boilerOneFuel);
    this.boilerTwoFuel = new FormControl(data.boilerTwoFuel);
    this.boilerThreeFuel = new FormControl(data.boilerThreeFuel); 
     this.boilerOnePercentage = new FormControl(data.boilerOnePercentage, [
      Validators.min(0),
      Validators.max(100) 
    ]); 
     this.boilerTwoPercentage = new FormControl(data.boilerTwoPercentage, [
      Validators.min(0),
      Validators.max(100) 
    ]); 
     this.boilerThreePercentage = new FormControl(data.boilerThreePercentage, [
      Validators.min(0),
      Validators.max(100) 
    ]); 
    this.activityType = new FormControl('Layby Berth');
    this.ETX = new FormControl('ETC');
    this.agencies = new FormControl<Agency[] | null>(this.agenciesPerLocation$.getValue()!);

    
    this.form = new FormGroup({
      duration : this.duration,
      ddggOne : this.ddggOne ,
      ddggTwo : this.ddggTwo ,
      ddggThree : this.ddggThree ,
      // ddGGBunker: this.ddGGBunker,
      boilerOneFuel : this.boilerOneFuel ,
      boilerTwoFuel : this.boilerTwoFuel ,
      boilerThreeFuel : this.boilerThreeFuel , 
      boilerOnePercentage : this.boilerOnePercentage , 
      boilerTwoPercentage : this.boilerTwoPercentage , 
      boilerThreePercentage : this.boilerThreePercentage , 
      ETX: this.ETX,
      activityType: this.activityType,
      agency: this.agencies
    })

   
  }


  ngOnInit(): void {
  }

}

