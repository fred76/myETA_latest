import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pdf-mask',
  templateUrl: './pdf-mask.component.html',
  styleUrls: ['./pdf-mask.component.css']
})
export class PdfMaskComponent implements OnInit {

  constructor() { }

  form: FormGroup

  byPort: FormControl = new FormControl(false)
  seaPassage: FormControl = new FormControl(false)
  ECA: FormControl = new FormControl(false)
  pilotageInbound: FormControl = new FormControl(false)
  pilotageOutbound: FormControl = new FormControl(false)
  loading: FormControl = new FormControl(false)
  discharging: FormControl = new FormControl(false)
  tankCleaning: FormControl = new FormControl(false)
  shifting: FormControl = new FormControl(false)
  laybyBerth: FormControl = new FormControl(false)
  bunkering: FormControl = new FormControl(false)
  anchoring: FormControl = new FormControl(false)
  drifting: FormControl = new FormControl(false)
  canalTransit: FormControl = new FormControl(false)
  activity: FormControl = new FormControl({ value: true, disabled: true })
  ETX: FormControl = new FormControl({ value: true, disabled: true })
  dateAndTime: FormControl = new FormControl({ value: true, disabled: true })
  expectedTime: FormControl = new FormControl(false)
  ladden: FormControl = new FormControl(false)
  cargo: FormControl = new FormControl(false)
  robDO: FormControl = new FormControl(false)
  robFO: FormControl = new FormControl(false)
  restockFO: FormControl = new FormControl(false)
  restockDO: FormControl = new FormControl(false)
  agency: FormControl = new FormControl(false)

  ngOnInit(): void {
    this.form = new FormGroup({
      byPort: this.byPort,
      seaPassage: this.seaPassage,
      ECA: this.ECA,
      pilotageInbound: this.pilotageInbound,
      pilotageOutbound: this.pilotageOutbound,
      loading: this.loading,
      discharging: this.discharging,
      tankCleaning: this.tankCleaning,
      shifting: this.shifting,
      laybyBerth: this.laybyBerth,
      bunkering: this.bunkering,
      anchoring: this.anchoring,
      drifting: this.drifting,
      canalTransit: this.canalTransit,
      activity: this.activity,
      ETX: this.ETX,
      dateAndTime: this.dateAndTime,
      expectedTime: this.expectedTime,
      ladden: this.ladden,
      cargo: this.cargo,
      robDO: this.robDO,
      robFO: this.robFO,
      restockFO: this.restockFO,
      restockDO: this.restockDO,
      agency: this.agency,
    })
  }

}
