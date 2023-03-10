import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { RotationService } from 'src/app/Core/Services/rotation.service'; 
import { ActivityPerLocation } from 'src/shared/schema/rotation.schema';

@Component({
  selector: 'app-home',
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.css']
})
export class RotationComponent implements OnInit {

  form: FormGroup

  utc: FormControl
  dateTime: FormControl
  robFO: FormControl
  robDO: FormControl

  isShowAddRotationButton = false

 location: ActivityPerLocation[] = []
 
  constructor(
    private appservice: MyElectronService, private rotationService: RotationService) {

 
  }

  rotation$ = this.rotationService.rotation$.asObservable()
 
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  ngOnInit(): void { 
    
    const rotation = this.rotationService.rotation$.getValue()

this.rotation$.subscribe(l => {
if (l){
 this.location = l?.activityPerLocations.sort((a,b) => a.idOrder - b.idOrder)}
} )

    if (rotation) { 
      
      let newDate = rotation.dateTime
      const format = 'yyyy-MM-dd HH:mm';
      const locale = 'en-UK';

      // const formattedDate = formatDate(rotation!.dateTime, format, locale);
      const formattedDate = formatDate(newDate, format, locale);

      this.dateTime = new FormControl(formattedDate, Validators.required)
      this.utc = new FormControl(rotation.utc,
        Validators.compose([
          Validators.min(-12),
          Validators.max(12),
          Validators.required
        ])
      )

      this.robFO = new FormControl(rotation.robFO, Validators.required)
      this.robDO = new FormControl(rotation.robDO, Validators.required)
    } else {
      let newDate = new Date()
      const format = 'yyyy-MM-dd HH:mm';
      const locale = 'en-UK';
 
      const formattedDate = formatDate(newDate, format, locale);

      this.dateTime = new FormControl(formattedDate, Validators.required)
      this.utc = new FormControl(null,
        Validators.compose([
          Validators.min(-12),
          Validators.max(12),
          Validators.required
        ])
      )

      this.robFO = new FormControl(null, Validators.required)
      this.robDO = new FormControl(null, Validators.required)

    }


    this.form = new FormGroup({
      utc: this.utc,
      dateTime: this.dateTime,
      robFO: this.robFO,
      robDO: this.robDO,
    })

    this.form.valueChanges.subscribe(v => { 
      if (
        this.utc.dirty &&
        this.dateTime.dirty &&
        this.robFO.dirty &&
        this.robDO.dirty) {
        this.isShowAddRotationButton = true

      }
      if (v) { 

        this.rotationService.addRotation(
          this.dateTime.value,
          this.utc.value,
          this.robFO.value,
          this.robDO.value
        )
      }
    })








  }



  addEmptyActivityPerLocation() {
    this.rotationService.addEmptyActivityPerLocation()
  }




} 