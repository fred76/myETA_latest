import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild, OnChanges, Inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs'; 
import { Agency, Port } from 'src/shared/schema/location.schema';
import { AgencyComponent } from '../agency.component';

@Component({
  selector: 'app-agency-mask',
  templateUrl: './agency-mask.component.html',
  styleUrls: ['./agency-mask.component.css']
})
export class AgencyMaskComponent implements OnInit, OnChanges {


  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  form: FormGroup

  agencyName: FormControl
  agencyPhone: FormControl
  agencyPhone1: FormControl
  agencyCell24Hrs: FormControl
  agencyGeneralEmail: FormControl
  agencyAddress: FormControl

  operatorName: FormControl
  operatorPhone: FormControl
  operatorCell: FormControl
  operatorEmail: FormControl
  operators: FormArray = <FormArray>{}


  constructor(private _ngZone: NgZone, private fb: FormBuilder, public dialogRef: MatDialogRef<AgencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnChanges() { }

  @Input() port: Port

  ngOnInit(): void {  
    if (this.data.agency) {
      this.agencyName = new FormControl(this.data.agency.agencyName)
      this.agencyPhone = new FormControl(this.data.agency.agencyPhone)
      this.agencyPhone1 = new FormControl(this.data.agency.agencyPhone1)
      this.agencyCell24Hrs = new FormControl(this.data.agency.agencyCell24Hrs)
      this.agencyGeneralEmail = new FormControl(this.data.agency.agencyGeneralEmail)
      this.agencyAddress = new FormControl(this.data.agency.agencyAddress)
    } 
    this.form = this.fb.group({
      agencyName: this.agencyName,
      agencyPhone: this.agencyPhone,
      agencyPhone1: this.agencyPhone1,
      agencyCell24Hrs: this.agencyCell24Hrs,
      agencyGeneralEmail: this.agencyGeneralEmail,
      agencyAddress: this.agencyAddress,
      operators: this.fb.array([])
    }) 
    if (this.data.agency) { 
      let t: Agency = this.data.agency

      t.operators.map(o => {

        let t = this.fb.group({

          operatorName: new FormControl(o.operatorName),
          operatorPhone: new FormControl(o.operatorPhone),
          operatorCell: new FormControl(o.operatorCell),
          operatorEmail: new FormControl(o.operatorEmail)
        })
        let a = this.form.get('operators') as FormArray 
        a.push(t); 
      }) 
    } 
  }
  get operatorsj(): FormArray {
    return <FormArray>this.form.get('operators');
  }

  createOperator(): FormGroup { 
    return this.fb.group({ 
      operatorName: this.operatorName,
      operatorPhone: this.operatorPhone,
      operatorCell: this.operatorCell,
      operatorEmail: this.operatorEmail,
    })
  }

  getOperators() {
    return (this.form.get('operators') as FormArray).controls
  }

  addOperator() {
    (this.form.get('operators') as FormArray).push(this.createOperator());
  }
  deleteOperator(i: number) {
    (this.form.get('operators') as FormArray).removeAt(i)
  }
 
  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }


}

