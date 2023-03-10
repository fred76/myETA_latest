import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { RotationService } from 'src/app/Core/Services/rotation.service';
import { Agency, Port } from 'src/shared/schema/location.schema';
import { AgencyMaskComponent } from './agency-mask/agency-mask.component';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['../details.component.css']
})
export class AgencyComponent implements OnInit {

  constructor(public dialog: MatDialog, private appService: MyElectronService, public rotationService: RotationService) { }

  @Input() port: Port

  agencies: Agency[]

  ngOnInit(): void {
    this.appService.getAgency(this.port).then(p => {
      this.agencies = p
    })
  }

  openDialogAgency(enterAnimationDuration: string, exitAnimationDuration: string): void {


    const dialogRef = this.dialog.open(AgencyMaskComponent, {
      width: '1100px',
      height: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: { port: this.port }
    })
    dialogRef.afterClosed().subscribe((result: Agency) => {

      if (result) {


        this.appService.addAgency(result, this.port).then(p => {
          this.agencies = p
        })
      }
    });
  }

  openDialogAgencyToEdit(enterAnimationDuration: string, exitAnimationDuration: string, agency: Agency): void {
 
    const dialogRef = this.dialog.open(AgencyMaskComponent, {
      width: '1100px',
      height: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: { port: this.port, agency: agency }
    })
    dialogRef.afterClosed().subscribe((result: Agency) => {

      if (result) { 
        result.id = agency.id 
        this.appService.editAgency(result).then(p => { 
          this.appService.getAgency(this.port).then(p => {
            this.agencies = p
          })
        })
      }
    });
  }

  delete(agency: Agency) {
    this.appService.deleteAgency(agency).then(p => {
      this.agencies = p
      this.appService.getRotation().then(r => { 
        this.rotationService.rotation$.next(r)  
      })
    })


  }

}
