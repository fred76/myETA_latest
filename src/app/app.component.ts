


import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MyElectronService } from 'src/app/Core/Services/electron.service';
import { RotationService } from './Core/Services/rotation.service';
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver, private router: Router, private appservice: MyElectronService, public rotationService: RotationService) {

    this.appservice.getRotation().then(r => {
      console.log(r);
      
      this.rotationService.rotation$.next(r)
    })

    this.appservice.getBunker().then(bunker => {
      this.rotationService.bunkerOption$.next(bunker) 
    })

  }

  exportShortRotation(){
    this.rotationService.shortRotation()
  }
  exportFullRotation(){
    this.rotationService.fullRotation()
  }
  compactRotation(){
    this.rotationService.compactRotation()
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