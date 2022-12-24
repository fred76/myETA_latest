import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { Agency, Berth, PltStation, Port } from 'src/shared/schema/location.schema';
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

  utcTime: FormControl

  selectedPltStation: PltStation
  selectedBerth: Berth
  selectedUTC: number

  isNewLoc$ = new BehaviorSubject<boolean>(true);

  @Input() indexLocation: number

  @Input() activityPerLocationModel: ActivityPerLocation

  @Input() isShortActivity: boolean = true

  activities : Activity[]=[]

  constructor(
    public dialog: MatDialog,
    private appservice: MyElectronService,
    public rotationService: RotationService) {


  }

  newRotation: Rotation
  newActivityPerLocation: ActivityPerLocation
  newActivity: Activity

  isNewLoaction: boolean = true

  berths: string[] = []
  agenciesPerLocation: Agency[] = []
  selectedPltStationName: string
  selectedPortName: string
  selectedBerthName: string

  selectedAgency: Agency

  reciveLocation(event: {
    selectedPortName: string,
    selectedPltStationName: string,
    selectedBerthName: string,
    close: boolean
  }) {

    this.selectedPltStationName = event.selectedPltStationName
    this.selectedPortName = event.selectedPortName
    this.selectedBerthName = event.selectedBerthName
    this.isNewLoc$.next(event.close)
  }

  ngOnInit(): void { 

    let newarra = this.activityPerLocationModel.activities
 
 
   this.activities =   newarra.sort((a,b) => a.idOrder - b.idOrder) 

    this.utcTime = new FormControl(this.activityPerLocationModel.utcTime,
      Validators.compose([
        Validators.min(-12),
        Validators.max(12),
        Validators.required
      ])
    )


    this.form = new FormGroup({
      utcTime: this.utcTime
    })

    this.utcTime.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(utc => {
        if (utc || utc === 0) {
          this.selectedUTC = utc
          this.rotationService.AddActivityPerLocation(
            this.indexLocation,
            this.selectedPortName,
            this.selectedPltStationName,
            this.selectedBerthName,
            utc
          )
        }
      })



    if (this.activityPerLocationModel.port === undefined &&
      this.activityPerLocationModel.pltStation === undefined &&
      this.activityPerLocationModel.berth === undefined &&
      this.activityPerLocationModel.utcTime === undefined) {
      this.isNewLoc$.next(false)
    } else {
      this.selectedPortName = this.activityPerLocationModel.port
      this.selectedPltStationName = this.activityPerLocationModel.pltStation
      this.selectedBerthName = this.activityPerLocationModel.berth
      this.utcTime.markAsDirty()


    }

  

  }

  editLoc() {
    this.form.patchValue({
      port: null,
      pltStation: null,
      berth: null,
      utcTime: null
    })
    this.isNewLoc$.next(false)
  }




  openDialogSeaPassage(enterAnimationDuration: string, exitAnimationDuration: string): void {
 

    const dialogRef = this.dialog.open(SeaPassageComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
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
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
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
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      result.activityType === 'Pilotage Inbound' ? result.ETX = 'ETB' : result.ETX = 'SoSP'
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
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {
      if (result) {
        result.mainEngineFuel = 'off'
        this.rotationService.addActivity(this.indexLocation, result)
      }

    });
  }
  openDialogShifting(enterAnimationDuration: string, exitAnimationDuration: string): void {

    this.appservice.getBerthByPort(this.activityPerLocationModel.port).then(b => {

      this.berths = b


      const dialogRef = this.dialog.open(ShiftingComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: { indexLocation: this.indexLocation, berths: this.berths, portName: this.activityPerLocationModel.port }
      });

      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {
          this.rotationService.addActivity(this.indexLocation, result)
        }
      });
    })
  }
  openDialogLayby(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(LaybyBerthComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
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
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
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
      data: { indexLocation: this.indexLocation, portName: this.activityPerLocationModel.port }
    });
    dialogRef.afterClosed().subscribe((result: Activity) => {

      if (result) {
        this.rotationService.addActivity(this.indexLocation, result)
      }


    });
  }

  deleteLocationActivitey() {
    this.rotationService.deleteLocationActivitey(this.indexLocation)
  }
  moveDownLocationActivitey() {
    this.rotationService.moveDownLocationActivitey(this.indexLocation)
  }
  moveUPLocationActivitey() {
    this.rotationService.moveUPLocationActivitey(this.indexLocation)
  }


}

