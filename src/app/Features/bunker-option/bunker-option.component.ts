import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { RotationService } from 'src/app/Core/Services/rotation.service';

@Component({
  selector: 'app-bunker-option',
  templateUrl: './bunker-option.component.html',
  styleUrls: ['./bunker-option.component.css']
})
export class BunkerOptionComponent implements OnInit, OnDestroy {

  form: FormGroup


  speedCruise: FormControl
  ballastCruise: FormControl
  laddenCruise: FormControl
  speed80: FormControl
  ballast80: FormControl
  ladden80: FormControl
  speed60: FormControl<number | null>
  ballast60: FormControl
  ladden60: FormControl
  speed40: FormControl
  ballast40: FormControl<number | null>
  ladden40: FormControl
  ddggDailyConsumption: FormControl
  boilerMinConsumption: FormControl
  boilerMaxConsumption: FormControl
  foMaxStorage: FormControl
  doMaxStorage: FormControl
  id: FormControl

  subscripion: Subscription



  constructor(private rotationService: RotationService, private electronService: MyElectronService) {
 
    this.speedCruise = new FormControl(null, Validators.required)
    this.ballastCruise = new FormControl(null, Validators.required)
    this.laddenCruise = new FormControl(null, Validators.required)
    this.speed80 = new FormControl(null, Validators.required)
    this.ballast80 = new FormControl(null, Validators.required)
    this.ladden80 = new FormControl(null, Validators.required)
    this.speed60 = new FormControl(null, Validators.required)
    this.ballast60 = new FormControl(null, Validators.required)
    this.ladden60 = new FormControl(null, Validators.required)
    this.speed40 = new FormControl(null, Validators.required)
    this.ballast40 = new FormControl(null, Validators.required)
    this.ladden40 = new FormControl(null, Validators.required)
    this.ddggDailyConsumption = new FormControl(null, Validators.required)
    this.boilerMinConsumption = new FormControl(null, Validators.required)
    this.boilerMaxConsumption = new FormControl(null, Validators.required)
    this.foMaxStorage = new FormControl(null, Validators.required)
    this.doMaxStorage = new FormControl(null, Validators.required)
    this.id = new FormControl(null)


    this.form = new FormGroup({
      ballast40: this.ballast40,
      ballast60: this.ballast60,
      ballast80: this.ballast80,
      ballastCruise: this.ballastCruise,
      boilerMaxConsumption: this.boilerMaxConsumption,
      boilerMinConsumption: this.boilerMinConsumption,
      ddggDailyConsumption: this.ddggDailyConsumption,
      doMaxStorage: this.doMaxStorage,
      foMaxStorage: this.foMaxStorage,
      id: this.id,
      ladden40: this.ladden40,
      ladden60: this.ladden60,
      ladden80: this.ladden80,
      laddenCruise: this.laddenCruise,
      speed40: this.speed40,
      speed60: this.speed60,
      speed80: this.speed80,
      speedCruise: this.speedCruise,
    })
 
  
  }

  onSubmit() { 
    this.electronService.addBunker(this.form.value)
    this.rotationService.bunkerOption$.next(this.form.value) 
  }


  ngOnInit(): void {  
    this.subscripion = this.rotationService.bunkerOption$.subscribe(o => { 
      if (o) {  
        this.form.setValue(o!)
      } 
    }
    ) 
  }

  ngOnDestroy(): void { 
    this.subscripion.unsubscribe()
  }

}
