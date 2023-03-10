import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Agency } from 'src/shared/schema/location.schema';
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
  agencies: FormControl 


  agenciesPerLocation$ = new BehaviorSubject<Agency[] | null>(null);

  constructor(public dialogRef: MatDialogRef<PortActivitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private appservice: MyElectronService
  ) {
    this.appservice.getAgencByPortName(this.data.portName).then(p => {   
      this.agenciesPerLocation$.next(p)
    })

    this.duration = new FormControl(data.duration, Validators.required)
    this.cargoOnBoardMT = new FormControl(data.cargoOnBoardMT)
    this.laddenPercentage = new FormControl(data.laddenPercentage, [
      Validators.min(0),
      Validators.max(100) 
    ])
    this.foExtimatecConsumption = new FormControl(data.foExtimatecConsumption, Validators.required)
    this.doExtimatecConsumption = new FormControl(data.doExtimatecConsumption, Validators.required)
    this.ETX = new FormControl('ETC');
    this.activityType = new FormControl('Canal Transit');
    this.agencies = new FormControl<Agency[] | null>(this.agenciesPerLocation$.getValue()!);

    

    this.form = new FormGroup({
      duration: this.duration,
      cargoOnBoardMT: this.cargoOnBoardMT,
      laddenPercentage: this.laddenPercentage,
      foExtimatecConsumption: this.foExtimatecConsumption,
      doExtimatecConsumption: this.doExtimatecConsumption,
      ETX: this.ETX,
      activityType: this.activityType,
      agency: this.agencies
    })


  }


  ngOnInit(): void { 
  }

}
