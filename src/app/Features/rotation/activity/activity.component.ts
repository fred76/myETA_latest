import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RotationService } from 'src/app/Core/Services/rotation.service';
import { Activity } from 'src/shared/schema/rotation.schema';
import { CanalTransitComponent } from '../cards/canal-transit/canal-transit.component';
import { LaybyBerthComponent } from '../cards/layby-berth/layby-berth.component';
import { OperationComponent } from '../cards/operation/operation.component';
import { PilotingComponent } from '../cards/piloting/piloting.component';
import { RestockBunkerComponent } from '../cards/restock-bunker/restock-bunker.component';
import { SeaPassageComponent } from '../cards/sea-passage/sea-passage.component';
import { ShiftingComponent } from '../cards/shifting/shifting.component';
import { WaitingAtSeaComponent } from '../cards/waiting-at-sea/waiting-at-sea.component';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { AgencyMaskComponent } from '../../loctation/agency/agency-mask/agency-mask.component';
import { Agency } from 'src/shared/schema/location.schema';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  constructor(private rotationService: RotationService,
    public dialog: MatDialog, private appservice: MyElectronService) { }

  @Input() indexActivity: number
  @Input() indexLocationActivityActivity: number
  @Input() activity: Activity

  noBunker = this.rotationService.noBunker$.asObservable();

  berths: string[] = []
 
  ngOnInit(): void { }

  openDialogAgencyToEdit(enterAnimationDuration: string, exitAnimationDuration: string): void {

    this.appservice.getAgencyByID(this.activity.agency.id).then(p => {
      const dialogRef = this.dialog.open(AgencyMaskComponent, {
        width: '1100px',
        height: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: { port: 'this.port', agency: p }
      })
      dialogRef.afterClosed().subscribe((result: Agency) => {

        if (result) {
          this.appservice.editPortAgentFromActivity(result).then(p => {

            this.activity.agency = p

          })
        }
      })
    })
  }

  //AA

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {


    if (this.activity.activityType === 'Sea Passage') {
      const dialogRef = this.dialog.open(SeaPassageComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {
          const duration = result.distance! / result.speed!
          result.duration = duration
          result.id = this.indexActivity

          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)
        }
      });
    }

    if (this.activity.activityType === 'Canal Transit') {
      const dialogRef = this.dialog.open(CanalTransitComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {
          result.id = this.indexActivity
          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)
        }
      });
    }

    if (this.activity.activityType === 'Pilotage Inbound' || this.activity.activityType === 'Pilotage Outbound') {
      const dialogRef = this.dialog.open(PilotingComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {
          result.activityType === 'Pilotage Inbound' ? result.ETX = 'ETB' : result.ETX = 'SoSP'
          result.id = this.indexActivity
          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)

        }
      });
    }
    if (this.activity.activityType === 'Loading' || this.activity.activityType === 'Discharging' || this.activity.activityType === 'Tank Cleaning') {
      const dialogRef = this.dialog.open(OperationComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {

          result.mainEngineFuel = 'off'
          result.id = this.indexActivity
          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)

        }
      });
    }
    if (this.activity.activityType === 'Shifting') {
      this.appservice.getBerthByActivityID(this.activity).then(b => {
        this.berths = b

        const dialogRef = this.dialog.open(ShiftingComponent, {
          width: '1100px',
          enterAnimationDuration,
          exitAnimationDuration,
          disableClose: true,
          data: { activity: this.activity, berths: this.berths }
        });

        dialogRef.afterClosed().subscribe((result: Activity) => {
          if (result) {
            result.id = this.indexActivity
            this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)

          }

        });
      })
    }
    if (this.activity.activityType === 'Layby Berth') {
      const dialogRef = this.dialog.open(LaybyBerthComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {

          result.mainEngineFuel = 'off'
          result.id = this.indexActivity
          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)

        }

      });
    }
    if (this.activity.activityType === 'Bunkering') {
      const dialogRef = this.dialog.open(RestockBunkerComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {

          result.mainEngineFuel = 'off'
          result.id = this.indexActivity
          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)

        }

      });
    }
    if (this.activity.activityType === 'Anchoring' || this.activity.activityType === 'Drifting') {
      const dialogRef = this.dialog.open(WaitingAtSeaComponent, {
        width: '1100px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
        data: this.activity
      });
      dialogRef.afterClosed().subscribe((result: Activity) => {
        if (result) {

          result.id = this.indexActivity
          this.rotationService.editActivity(this.indexLocationActivityActivity, this.indexActivity, result)

        }

      });
    }
  }

  deleteActivity() {
    this.rotationService.deleteActivitey(this.indexLocationActivityActivity, this.indexActivity)
  }

  moveDownActivitey() {
    this.rotationService.moveDownActivitey(this.indexActivity, this.indexLocationActivityActivity)
  }
  moveUpActivitey() {
    this.rotationService.moveUpActivitey(this.indexActivity, this.indexLocationActivityActivity)
  }

}
