import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Berth, BerthNotes } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-berth-details',
  templateUrl: './berth-details.component.html',
  styleUrls: ['../details.component.css']
})
export class BerthDetailsComponent implements OnInit, OnChanges {


  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private _ngZone: NgZone, private fb: FormBuilder, private appService: MyElectronService) { }

  form: FormGroup; 



  berthNote: FormControl
  berthTitle: FormControl




  @Input() berth: Berth
  
  notes: BerthNotes[] = []



  ngOnChanges() {
    this.form = this.fb.group({
      items: this.fb.array([])
    })
    this.appService.getBerthNotes(this.berth).then(p => {
      p.map(o => {
        (this.form.get('items') as FormArray).push(this.createItem(o.berthTitle, o.berthNote))
      }) 
      this.notes = p
    })


  }

  ngOnInit(): void { }

  createItem(berthTitle: string, berthNote: string) {
    return this.fb.group({
      berthTitle: [berthTitle],
      berthNote: [berthNote]
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
      this.appService.deleteBerthNotes(this.notes[i]).then(n => {
        this.notes = n
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
    note.get('berthNote')?.markAsPristine()
    note.get('berthNote')?.markAsUntouched()
    let newBerthNote = new BerthNotes();
    newBerthNote.berthTitle = note.get('berthTitle')?.value
    newBerthNote.berthNote = note.get('berthNote')?.value
    this.appService.addBerthNotes(newBerthNote, this.berth).then(p => {
      this.notes = p
    })
  } else { 

    const noteForm = (this.form.get('items') as FormArray).at(i)
    noteForm.get('berthNote')?.markAsPristine()
    noteForm.get('berthNote')?.markAsUntouched() 
    let n = this.notes[i] 
    n.berthTitle = noteForm.get('berthTitle')?.value
    n.berthNote = noteForm.get('berthNote')?.value 
    this.appService.editBerthNotes(n).then(p=> {
      this.notes = p  
    }) 
  }
  } 
  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }


} 