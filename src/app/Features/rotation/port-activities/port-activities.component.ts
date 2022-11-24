import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Berth, PltStation, Port } from 'src/shared/schema/location.schema';
  import { ActivityModel, ActivityPerLocationModel, RotationModel } from 'src/shared/entity/rotation-model';
import { SeaPassageComponent } from '../cards/sea-passage/sea-passage.component';
import { CanalTransitComponent } from '../cards/canal-transit/canal-transit.component';
import { PilotingComponent } from '../cards/piloting/piloting.component';
import { OperationComponent } from '../cards/operation/operation.component';
import { ShiftingComponent } from '../cards/shifting/shifting.component';
import { LaybyBerthComponent } from '../cards/layby-berth/layby-berth.component';
import { RestockBunkerComponent } from '../cards/restock-bunker/restock-bunker.component';
import { WaitingAtSeaComponent } from '../cards/waiting-at-sea/waiting-at-sea.component';
import { RotationService } from 'src/app/Core/Services/rotation.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, of } from 'rxjs';
import { Activity, ActivityPerLocation, Rotation } from 'src/shared/schema/rotation.schema';

@Component({
  selector: 'app-port-activities',
  templateUrl: './port-activities.component.html',
  styleUrls: ['./port-activities.component.css']
})
export class PortActivitiesComponent implements OnInit {

  form: FormGroup


  pltStation: FormControl
  port: FormControl
  berth: FormControl
  utcTime: FormControl

  portsByCountry: Port[] = []
  pltStationsa: PltStation[] = []
  berthsa: Berth[] = []

  selectedPort: Port = new Port()
  selectedPltStation: PltStation
  selectedBerth: Berth
  selectedUTC: number

  isNewLoc$ = new BehaviorSubject<boolean>(true);

  @Input() indexLocation: number

  @Input() activityPerLocationModel: ActivityPerLocation

  constructor(
    public dialog: MatDialog,
    private appservice: MyElectronService,
    private rotationService: RotationService) {

    this.getPltStation()

  }

  newRotation: Rotation
  newActivityPerLocation: ActivityPerLocation
  newActivity: Activity

  isNewLoaction: boolean = true

  ngOnInit(): void { ;

    if (this.activityPerLocationModel.port === undefined &&
      this.activityPerLocationModel.pltStation === undefined &&
      this.activityPerLocationModel.berth === undefined &&
      this.activityPerLocationModel.utcTime === undefined) {
      this.isNewLoc$.next(false)
    }


    let utc: number = 0 
    this.port = new FormControl(null, Validators.required)
    this.pltStation = new FormControl(null, Validators.required)
    this.berth = new FormControl(null, Validators.required)
    this.utcTime = new FormControl(null,
      Validators.compose([
        Validators.min(-12),
        Validators.max(12),
        Validators.required
      ])
    )
    this.form = new FormGroup({
      utcTime: this.utcTime,
      pltStation: this.pltStation,
      port: this.port,
      berth: this.berth
    })

 
    this.pltStation.valueChanges
      .subscribe((pltStation) => {
        this.port.reset();
        this.port.disable();
        if (pltStation) {
          this.selectedPltStation = pltStation 
          this.getPort(pltStation)
          this.port.enable();
        }
      })

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
          this.selectedBerth = berth;
          this.utcTime.enable()

        }
      })


    this.utcTime.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ).subscribe(utc => { 
        if (utc || utc === 0) { 
          this.isNewLoc$.next(true)
          this.selectedUTC = utc
          this.rotationService.AddActivityPerLocation(
            this.indexLocation,
            this.selectedPort.portName,
            this.selectedPltStation.pltStationName,
            this.selectedBerth.berthName,
            utc
          )
        }
      })
  }

  editLoc(){
    this.form.patchValue({
      port: null,
      pltStation: null,
      berth: null,
      utcTime: null 
    })
    this.isNewLoc$.next(false)
  }


 getPltStation() {

    this.appservice.getPltStationAll( ).then(pltStations => {
      this.pltStationsa = pltStations
    })
  }

  getPort(pltStation: PltStation) {
    this.appservice.getPort(pltStation).then(ports => { 
      this.portsByCountry = ports
    })
  }


   

  

  getBerth(port: Port) {
    this.appservice.getBerth(port).then(berths => {
      this.berthsa = berths
    })
  }

  openDialogSeaPassage(enterAnimationDuration: string, exitAnimationDuration: string): void {


    const dialogRef = this.dialog.open(SeaPassageComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {

      if (result) {
        const duration = result.distance! / result.speed!
        result.duration = duration
        this.rotationService.addActivity(this.indexLocation, result) 
      }
    });
  }
  openDialogCanalTransit(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(CanalTransitComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {
        this.rotationService.addActivity(this.indexLocation, result)
      }
    });
  }
  openDialogPiloting(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(PilotingComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {
        this.rotationService.addActivity(this.indexLocation, result)
      }
    });
  }
  openDialogOperation(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(OperationComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {
        result.mainEngineFuel = 'off'
        this.rotationService.addActivity(this.indexLocation, result)
      }

    });
  }
  openDialogShifting(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ShiftingComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.berthsa
    });

    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {  
        this.rotationService.addActivity(this.indexLocation, result)
      }
    });
  }
  openDialogLayby(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(LaybyBerthComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {
        result.mainEngineFuel = 'off'
        this.rotationService.addActivity(this.indexLocation, result)
      }
    });
  }
  openDialogRestock(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(RestockBunkerComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {
        result.mainEngineFuel = 'off'
        this.rotationService.addActivity(this.indexLocation, result)
      }
    });
  }
  openDialogWaitingAtSea(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(WaitingAtSeaComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: this.indexLocation
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {

      if (result) {
        this.rotationService.addActivity(this.indexLocation, result)
      }


    });
  }

  deleteLocationActivitey(){
    this.rotationService.deleteLocationActivitey(this.indexLocation)
  }
  moveDownLocationActivitey(){
    this.rotationService.moveDownLocationActivitey(this.indexLocation)
  }
  moveUPLocationActivitey(){
    this.rotationService.moveUPLocationActivitey(this.indexLocation)
  }

 
}
