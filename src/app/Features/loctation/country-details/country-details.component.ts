import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css']
})
export class CountryDetailsComponent implements OnInit {

  forma: FormGroup;
  form: FormGroup;
  createItem() {
    return this.fb.group({
      countryNote: [''],
      countryTitle: ['']
    })
  }
  addNext() {
    (this.form.get('items') as FormArray).push(this.createItem())
  }

  getControls() {
    return (this.form.get('items') as FormArray).controls;
  }

  countryNotes: { title: string, text: string }[] = []

  ngOnInit(): void {
    this.form = this.fb.group({
      items: this.fb.array([this.createItem()])
    })
  }

  constructor(private _ngZone: NgZone, private fb: FormBuilder) {
    


    this.forma = new FormGroup({
      countryNote: this.countryNote,
      countryTitle: this.countryTitle
    });
  }
  formValue(): void {
    console.log(this.form.value);
  }


  addNotes(title: string, text: string) {
    this.countryTitle = new FormControl<string | null>(title,
      { nonNullable: true });
    this.countryNote = new FormControl<string | null>(text,
      { nonNullable: true });

    this.countryNotes.push({ title, text })
  }

  get getFc() {
    return this.forma.controls;
  }

  saveNote(i: number) {

    const title = this.getFc['countryNote']!.value
    const text = this.getFc['countryTitle']!.value

    const p = { title: title, text: text }


    this.countryNotes.splice(i, 0)

    this.countryNotes[i] = p
    console.log('this.countryNotes');
    console.log(this.countryNotes);


  }


  countryTitle: FormControl = new FormControl<string | null>(null,
    { nonNullable: true });
  countryNote: FormControl = new FormControl<string | null>(null,
    { nonNullable: true });


  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }


}
