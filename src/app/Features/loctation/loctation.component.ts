import { Component, OnInit } from '@angular/core';
import { MyElectronService } from 'src/app/Core/Services/electron.service'; 
import { Berth, Country, PltStation, Port } from 'src/shared/schema/location.schema';
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
  constructor(private appservice: MyElectronService, private rotationService  :RotationService) {

    this.getCountry();

    this.form = new FormGroup({
      country: this.country,
      portCountry: this.portsCountry,
      pltStationPort: this.pltStationPort,
      berthPltStation: this.berthPltStation,
      countryInput: this.countryInput,
      portInput: this.portInput,
      pltStationInput: this.pltStationInput,
      berthInput: this.berthInput,

    });
  }

  form: FormGroup; 

  country = new FormControl<Country | null>(null,
    { nonNullable: true, validators: [Validators.required ] });

    pltStationPort = new FormControl<PltStation | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required ] });

  portsCountry = new FormControl<Port | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required ] });

  

  berthPltStation = new FormControl<Berth | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required ] });
 
  countryInput = new FormControl<string>('', { nonNullable: true })

  portInput = new FormControl<string>('', { nonNullable: true })

  pltStationInput = new FormControl<string>('', { nonNullable: true })

  berthInput = new FormControl<string>('', { nonNullable: true })

  
  countries: Country[] = []
  portsByCountry: Port[] = []
  pltStations: PltStation[] = []
  berths: Berth[] = []

  selectedCountry: Country;
  selectedPort: Port;
  selectedPltStation: PltStation;
  selectedBerth: Berth;
 
  newCountryName: string
  newPortyName: string
  newPltStationyName: string
  newBerthName: string

  ngOnInit(): void {

    this.country.valueChanges.subscribe((country) => {  
      this.pltStationPort.reset();
      this.pltStationPort.disable(); 
      if (country) { 
        this.selectedCountry = country 
        this.getPltStation(country)
        this.pltStationPort.enable();
      }
    });

    this.pltStationPort.valueChanges
    .subscribe((pltStation) => {
      this.portsCountry.reset();
      this.portsCountry.disable();
      if (pltStation) {
        this.selectedPltStation = pltStation 
        this.getPort(pltStation)
        this.portsCountry.enable();
      }
    })

    this.portsCountry.valueChanges
      .subscribe((port) => {
        this.berthPltStation.reset();
        this.berthPltStation.disable();
        if (port) {
          this.selectedPort = port 
          this.getBerth(port)
          this.berthPltStation.enable();
        }
      })
   
    this.berthPltStation.valueChanges
      .subscribe((berth) => { 
        if (berth) {
          this.selectedBerth = berth 
         
        }
      })
  
 
    this.countryInput.valueChanges.subscribe((newCountryName) => {
      this.newCountryName = newCountryName
    })
    this.portInput.valueChanges.subscribe((newPortyName) => {
      this.newPortyName = newPortyName
    })
    this.pltStationInput.valueChanges.subscribe((newPltStationyName) => {
      this.newPltStationyName = newPltStationyName
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

 getPltStation(country: Country) {
    this.appservice.getPltStation(country).then(pltStations => {
      this.pltStations = pltStations
    })
  }
   
  getPort(pltStation: PltStation) {
    this.appservice.getPort(pltStation).then(ports => {
      this.portsByCountry = ports
    })
  }

 

  getBerth(port: Port) {
    this.appservice.getBerth(port).then(berths => {
      this.berths = berths
    })
  }
 
  addCountry(country: string): void {
    let newCountry = new Country();
    newCountry.countryName = country
    this.appservice.addCountry(newCountry).then(country => { 
      this.countries.push(country) 
      this.country.patchValue(country)
    }
    )
  }

   addPltStation(pltStation: string, country: Country): void { 
    let newPltStation = new PltStation();
    newPltStation.pltStationName = pltStation
    this.appservice.addPltStation(newPltStation, country).then(pltStation => {
     this.pltStations.push(pltStation)
     this.pltStationPort.patchValue(pltStation)
    })
  }

  addPort(port: string, pltStation: PltStation): void {
    let newPort = new Port();
    newPort.portName = port 
     
    this.appservice.addPort(newPort, pltStation).then(port => {  
      this.portsByCountry.push(port) 
      this.portsCountry.patchValue(port)
    })
  }

 
  addBerth( berth: string, port: Port): void { 
    let newBerth = new Berth();
    newBerth.berthName = berth
    this.appservice.addBerth(newBerth, port).then(berth => {
     this.berths.push(berth)
     this.berthPltStation.patchValue(berth)
    })
  }

  deleteCountry(country: Country) {
    this.appservice.deleteCountry(country).then(countries => {
      this.countries = countries 
      this.portsCountry.reset();
      this.portsCountry.disable();
      this.pltStationPort.reset();
      this.pltStationPort.disable();
      this.berthPltStation.reset();
      this.berthPltStation.disable();
    })
  }

  deletePort(port: Port) {
    this.appservice.deletePort(port).then(ports => {
       this.portsByCountry = ports  
       this.portsCountry.reset();
       this.portsCountry.disable();
       this.pltStationPort.reset();
       this.pltStationPort.disable();
       this.berthPltStation.reset();
       this.berthPltStation.disable();
    })
  }

  deletePltStation(pltStation: PltStation) {
    this.appservice.deletePltStation(pltStation).then(pltStations => {
       this.pltStations = pltStations  
       this.pltStationPort.reset();
       this.pltStationPort.disable();
       this.berthPltStation.reset();
       this.berthPltStation.disable();
    })
  }

  deleteBerth(berth: Berth) { 
    this.appservice.deleteBerth(berth).then(berths => {
       this.berths = berths 
       this.berthPltStation.reset();
       this.berthPltStation.disable();
    })
  }

  

}
