import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Port, PortNotes } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-port-details',
  templateUrl: './port-details.component.html',
  styleUrls: ['../details.component.css']
})
export class PortDetailsComponent implements OnInit, OnChanges {


  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private _ngZone: NgZone, private fb: FormBuilder, private appService: MyElectronService) { }

  form: FormGroup;



  portNote: FormControl
  portTitle: FormControl




  @Input() port: Port

  notes: PortNotes[] = []



  ngOnChanges() {
    this.form = this.fb.group({
      items: this.fb.array([])
    })
    this.appService.getPortNotes(this.port).then(p => {
      p.map(o => {
        (this.form.get('items') as FormArray).push(this.createItem(o.portTitle, o.portNote))
      })
      this.notes = p
    })


  }

  ngOnInit(): void { }

  createItem(portTitle: string, portNote: string) {
    return this.fb.group({
      portTitle: [portTitle],
      portNote: [portNote]
    })
  }


  get items(): FormArray {
    return (this.form.get('items') as FormArray)
  }


  addNext() {
    (this.form.get('items') as FormArray).push(this.createItem('', ''))
  }

  remove(i: number) { 

    if (this.notes.length > 0 && this.notes[i].id !== undefined) {  
      
      this.appService.deletePortNotes(this.notes[i]).then(n => {
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
      const noteForm = (this.form.get('items') as FormArray).at(i)
      noteForm.get('portNote')?.markAsPristine()
      noteForm.get('portNote')?.markAsUntouched()
      let newPortNote = new PortNotes();
      newPortNote.portTitle = noteForm.get('portTitle')?.value
      newPortNote.portNote = noteForm.get('portNote')?.value
      this.appService.addPortNotes(newPortNote, this.port).then(p => {
        this.notes = p
      })
    } else { 

      const noteForm = (this.form.get('items') as FormArray).at(i)
      noteForm.get('portNote')?.markAsPristine()
      noteForm.get('portNote')?.markAsUntouched() 
      let n = this.notes[i] 
      n.portTitle = noteForm.get('portTitle')?.value
      n.portNote = noteForm.get('portNote')?.value 
      this.appService.editPortNotes(n).then(p=> {
        this.notes = p  
      }) 
    }
 
  }



  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }


} 