import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Agency, Berth, Country, PltStation, Port } from 'src/shared/schema/location.schema';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RotationService } from 'src/app/Core/Services/rotation.service';



@Component({
  selector: 'app-leg-planner',
  templateUrl: './leg-planner.component.html',
  styleUrls: ['./leg-planner.component.css']
})
export class LegPlannerComponent implements OnInit {



  constructor(private appservice: MyElectronService, private rotationService: RotationService) {

    this.getCountry();




    this.form = new FormGroup({
      country: this.country,
      port: this.port,
      pltStation: this.pltStation,
      berth: this.berth,
      agency: this.agency,
      portInput: this.portInput,
      pltStationInput: this.pltStationInput,
      berthInput: this.berthInput,

    });
  }

  form: FormGroup;



  country = new FormControl<Country | null>(null,
    { nonNullable: true, validators: [Validators.required] });

  port = new FormControl<Port | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required] });

  pltStation = new FormControl<PltStation | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required] });

  berth = new FormControl<Berth | null>({ value: null, disabled: true },
    { nonNullable: true, validators: [Validators.required] });

  agency = new FormControl<Agency | null>({ value: null, disabled: true });


  portInput = new FormControl<string>('', { nonNullable: true })

  pltStationInput = new FormControl<string>('', { nonNullable: true })

  berthInput = new FormControl<string>('', { nonNullable: true })


  countries: Country[] = []
  ports: Port[] = []
  pltStations: PltStation[] = []
  berths: Berth[] = []
  agencies: Agency[] = []

  selectedCountry: Country | null
  selectedPort: Port | null
  selectedPltStation: PltStation | null
  selectedBerth: Berth | null
  selectedAgency: Agency | null

  newPort: string | null
  newPltStationyName: string | null
  newBerthName: string | null

  showAdd: boolean = false

  @Output() location: EventEmitter<{
    selectedPortName: string,
    selectedPltStationName: string,
    selectedBerthName: string,
    close: boolean
  }> = new EventEmitter();

  @Input() getLocation: {
    selectedPortName: string,
    selectedPltStationName: string,
    selectedBerthName: string,
    close: boolean
  }

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
        this.pltStation.reset();
        this.pltStation.disable();
        if (port) {
          this.selectedPort = port
          this.getPltStation(port)
          this.getAgency();
          this.pltStation.enable();
        }
      })

    this.pltStation.valueChanges
      .subscribe((pltStation) => {
        this.berth.reset();
        this.berth.disable();
        if (pltStation) {
          this.selectedPltStation = pltStation
          this.getBerth(this.selectedPort!)
          this.berth.enable();
        }
      })



    this.berth.valueChanges
      .subscribe((berth) => {
        this.agency.reset();
        this.agency.disable();
        if (berth) {
          this.selectedBerth = berth
          this.agency.enable();
        }
      })

    this.agency.valueChanges
      .subscribe(agency => {
        if (agency) {
          this.selectedAgency = agency
        }
      })

    this.portInput.valueChanges.subscribe((newPort) => {
      this.newPort = newPort

    })

    this.pltStationInput.valueChanges.subscribe((newPltStationyName) => {
      this.newPltStationyName = newPltStationyName

    })

    this.berthInput.valueChanges.subscribe((newBerthName) => {
      this.newBerthName = newBerthName
    })
  }

  showAddPPB() {
    this.showAdd = !this.showAdd
  }

  passLocation() {
    this.location.emit({
      selectedPortName: this.selectedPort!.portName!,
      selectedPltStationName: this.selectedPltStation?.pltStationName!,
      selectedBerthName: this.selectedBerth?.berthName!,
      close: true
    })
  }

  getAgency() {
    this.appservice.getAgency(this.selectedPort!).then(agencies => {
      this.agencies = agencies
    })
  }
  getCountry() {
    this.appservice.getCountry().then(countries => {
      this.countries = countries
    })
  }

  getPltStation(port: Port) {
    this.appservice.getPltStation(port).then(pltStations => {
      this.pltStations = pltStations
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

  addPltStation(pltStation: string, port: Port): void {
    let newPltStation = new PltStation();
    newPltStation.pltStationName = pltStation
    this.appservice.addPltStation(newPltStation, port).then(pltStation => {
      this.pltStations.push(pltStation)
      this.form.get('pltStation')!.patchValue(pltStation!)
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