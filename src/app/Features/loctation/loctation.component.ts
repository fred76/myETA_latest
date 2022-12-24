import { Component, OnInit } from '@angular/core';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Berth, Country, Port } from 'src/shared/schema/location.schema';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RotationService } from 'src/app/Core/Services/rotation.service';


@Component({
  selector: 'app-loctation',
  templateUrl: './loctation.component.html',
  styleUrls: ['./loctation.component.css']
})
export class LoctationComponent implements OnInit {
  constructor(private appservice: MyElectronService, private rotationService: RotationService) {
   
    this.getCountry();
 
    this.form = new FormGroup({
      country: this.country,
      port: this.port, 
      berth: this.berth,
      portInput: this.portInput, 
      berthInput: this.berthInput 
    });
  }

  form: FormGroup;



  country = new FormControl<Country | null>(null,
    { nonNullable: true, validators: [Validators.required] });

  port = new FormControl<Port | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required] });
 
  berth = new FormControl<Berth | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required] });


  portInput = new FormControl<string>('', { nonNullable: true }) 

  berthInput = new FormControl<string>('', { nonNullable: true })


  countries: Country[] = []
  ports: Port[] = [] 
  berths: Berth[] = []

  selectedCountry: Country | null
  selectedPort: Port | null 
  selectedBerth: Berth | null

  newPort: string | null 
  newBerthName: string | null

  ngOnInit(): void {

    this.country.valueChanges.subscribe((country) => {
      this.port.reset();
      this.port.disable();
      if (country) {
        this.selectedCountry = country
        this.getPort(country)
        this.port.enable();
      }
    });

    this.port.valueChanges
      .subscribe((port) => {
        this.berth.reset();
        this.berth.disable();
        if (port) {
          this.selectedPort = port
          this.getBerth(port)
          this.berth.enable();
        }
      })

  



    this.berth.valueChanges
      .subscribe((berth) => {
        if (berth) {
          this.selectedBerth = berth
        }
      })




    this.portInput.valueChanges.subscribe((newPort) => {
      this.newPort = newPort

    })

 

    this.berthInput.valueChanges.subscribe((newBerthName) => {
      this.newBerthName = newBerthName
    })
  }

  getCountry() {
    this.appservice.getCountry().then(countries => {
      this.countries = countries
    })
  }
 
  getPort(country: Country) {
    this.appservice.getPort(country).then(ports => {
      this.ports = ports
    })
  }
 
  getBerth(port: Port) {
    this.appservice.getBerth(port).then(berths => {
      this.berths = berths
    })
  }

  addPort(port: string, country: Country): void {
    let newPort = new Port();
    newPort.portName = port

    this.appservice.addPort(newPort, country).then(port => {
      port.unlocs = ''
      this.ports.push(port)
      this.form.get('port')!.patchValue(port!)
    })
  }
 
 

  addBerth(berth: string, port: Port): void {
    let newBerth = new Berth();
    newBerth.berthName = berth
    this.appservice.addBerth(newBerth, port).then(berth => {
      this.berths.push(berth)
      this.form.get('berth')!.patchValue(berth!)
      this.form.get('berth')!.markAsDirty()
    })
  }
}
