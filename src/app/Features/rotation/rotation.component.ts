import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { RotationService } from 'src/app/Core/Services/rotation.service';
import { Rotation } from 'src/shared/schema/rotation.schema';
@Component({
  selector: 'app-home',
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.css']
})
export class RotationComponent implements OnInit {

  form: FormGroup

  utcTime: FormControl
  dateTime: FormControl
  robFo: FormControl
  robDo: FormControl

  isRotation = false
  isShowAddRotationButton = false

  rotation: Rotation

 

  rot() {
    this.appservice.addRotation(this.rotation)
  }

  constructor(
    private appservice: MyElectronService, private rotationService: RotationService) {


    this.rotationService.rotation$.subscribe(r => {

      if (r) {
        this.rotation = r
        this.rotationService.rotation$.getValue() != r
        this.isRotation = true
        if (r.dateTime && r.robDO && r.robFO && r.utc) {
          this.isShowAddRotationButton = true
        }
      }
    })

    let newDate = new Date()
    const format = 'yyyy-MM-dd HH:mm';
    const locale = 'en-UK';

    const formattedDate = formatDate(newDate, format, locale);



    this.dateTime = new FormControl(formattedDate, Validators.required)
    this.utcTime = new FormControl(null,
      Validators.compose([
        Validators.min(-12),
        Validators.max(12),
        Validators.required
      ])
    )

    this.robFo = new FormControl(null, Validators.required)
    this.robDo = new FormControl(null, Validators.required)

    this.form = new FormGroup({
      utcTime: this.utcTime,
      dateTime: this.dateTime,
      robFo: this.robFo,
      robDo: this.robDo,
    })

  }

   
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  ngOnInit(): void {


    this.form.valueChanges.subscribe(v => {
      if (
        this.utcTime.dirty &&
        this.dateTime.dirty &&
        this.robFo.dirty &&
        this.robDo.dirty) {
        this.isShowAddRotationButton = true

      }
      if (v) {

        this.rotationService.addRotation(
          this.dateTime.value,
          this.utcTime.value,
          this.robFo.value,
          this.robDo.value
        )
      }
    })

    if (this.rotation !== undefined) {
      const format = 'yyyy-MM-dd HH:mm';
      const locale = 'en-UK';

      const formattedDate = formatDate(this.rotation.dateTime, format, locale);

      this.form.setValue({
        utcTime: this.rotation.utc,
        dateTime: formattedDate,
        robFo: this.rotation.robFO,
        robDo: this.rotation.robDO
      })
    }


  }

  isShowRotationInitial() {
    this.isRotation = !this.isRotation
  }

  addEmptyActivityPerLocation() {
    this.rotationService.addEmptyActivityPerLocation()
  }


 

} 