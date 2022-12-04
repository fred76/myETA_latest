import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Country, CountryNotes } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['../details.component.css']
})
export class CountryDetailsComponent implements OnInit, OnChanges {


  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private _ngZone: NgZone, private fb: FormBuilder, private appService: MyElectronService) { }

  form: FormGroup;
  formNote: FormGroup;



  countryNote: FormControl
  countryTitle: FormControl




  @Input() country: Country
  notes: CountryNotes[] = []



  ngOnChanges() {
    this.form = this.fb.group({
      items: this.fb.array([])
    })
    this.appService.getCountryNotes(this.country).then(p => {
      p.map(o => {
        (this.form.get('items') as FormArray).push(this.createItem(o.countryTitle, o.countryNote))
      }) 
      this.notes = p
    })


  }

  ngOnInit(): void { }

  createItem(countryTitle: string, countryNote: string) {
    return this.fb.group({
      countryTitle: [countryTitle],
      countryNote: [countryNote]
    })
  }


  get items(): FormArray {
    return (this.form.get('items') as FormArray)
  }


  addNext() {
    (this.form.get('items') as FormArray).push(this.createItem('', ''))
  }

  remove(i: number) {  
    if (this.notes.length>0 && this.notes[i].id !== undefined) { 
      this.appService.deleteCountryNotes(this.notes[i]).then(n => {
        this.notes = n
        console.log(n);
        
      })
    }
    const o = this.form.get('items') as FormArray
    o.removeAt(i); 
  }

  getControls() {
    return (this.form.get('items') as FormArray).controls
  }
 
  saveNote(i: number) {
    if (this.notes[i] === undefined) {  
    const note = (this.form.get('items') as FormArray).at(i)
    note.get('countryNote')?.markAsPristine()
    note.get('countryNote')?.markAsUntouched()
    let newCountryNote = new CountryNotes();
    newCountryNote.countryTitle = note.get('countryTitle')?.value
    newCountryNote.countryNote = note.get('countryNote')?.value
    this.appService.addCountryNotes(newCountryNote, this.country).then(p => {
      this.notes = p
    })
  } else { 

    const noteForm = (this.form.get('items') as FormArray).at(i)
    noteForm.get('countryNote')?.markAsPristine()
    noteForm.get('countryNote')?.markAsUntouched() 
    let n = this.notes[i] 
    n.countryTitle = noteForm.get('countryTitle')?.value
    n.countryNote = noteForm.get('countryNote')?.value 
    this.appService.editCountryNotes(n).then(p=> {
      this.notes = p  
    }) 
  }
  } 
  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }


} 