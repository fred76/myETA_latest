import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { RotationService } from './Core/Services/rotation.service';

import port from 'src/shared/port.json'
import { PdfMaskComponent } from './Features/utility/pdf-mask/pdf-mask.component';
import { MatDialog } from '@angular/material/dialog';
import { PDFsetup } from 'src/shared/entity/rotation-model'; 
import { ImportDialogComponent } from './Features/utility/import-dialog/import-dialog.component';
import { AboutComponent } from './Features/utility/about/about.component';
 
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

   
  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private appservice: MyElectronService,
    public rotationService: RotationService,
    public dialog: MatDialog ) {
    this.appservice.getRotation().then(r => { 
      this.rotationService.rotation$.next(r)
      this.rotationService.isLoading$.next(true)

    })
    this.appservice.getBunker().then(bunker => {
      this.rotationService.bunkerOption$.next(bunker)
      if (bunker !== undefined) { 
        this.rotationService.noBunker$.next(true)
      }

    })

    let ports: any[] = port

    this.appservice.getCountry().then(countries => {

      if (countries.length === 0) {
        this.appservice.addCountryPorts(ports).then(p => {
        })
      }
    }) 
  }

  ngOnInit(): void { 
  }

  openPDFMask(enterAnimationDuration: string, exitAnimationDuration: string): void {


    const dialogRef = this.dialog.open(PdfMaskComponent, {
      width: '1100px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: null
    });
    dialogRef.afterClosed().subscribe((result: PDFsetup) => {

      if (result) { 
        this.rotationService.fullRotation(result) 
      }
    });
  }

  openImport(enterAnimationDuration: string, exitAnimationDuration: string): void {


    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: null
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
 
      if (result) { 
       this.importRotation()
      }
    });
  }

  openAbout(enterAnimationDuration: string, exitAnimationDuration: string): void {


    const dialogRef = this.dialog.open(AboutComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
      data: null
    });
    
  }



  compactRotation() {
    this.rotationService.compactRotation()
  }
  exportRotation() {
    this.rotationService.exportRotation()
  }
  importRotation()  {
    return this.rotationService.importRotation() 
  }


  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 1000px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
}
