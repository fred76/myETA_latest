import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './Core/Modules/material.module';
import { DateFnsModule } from 'ngx-date-fns';
import { FlexLayoutModule } from '@angular/flex-layout'; 
import { AppRoutingModule } from './app-routing.module';
import { MyElectronService } from './Core/Services/electron.service';
import { ElectronService } from 'ngx-electronify/node_modules/ngx-electronyzer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoctationComponent } from './Features/loctation/loctation.component';
import { ActivityComponent } from './Features/rotation/activity/activity.component';
import { SeaPassageComponent } from './Features/rotation/cards/sea-passage/sea-passage.component';
import { PilotingComponent } from './Features/rotation/cards/piloting/piloting.component';
import { OperationComponent } from './Features/rotation/cards/operation/operation.component';
import { WaitingAtSeaComponent } from './Features/rotation/cards/waiting-at-sea/waiting-at-sea.component';
import { LaybyBerthComponent } from './Features/rotation/cards/layby-berth/layby-berth.component';
import { ShiftingComponent } from './Features/rotation/cards/shifting/shifting.component';
import { CanalTransitComponent } from './Features/rotation/cards/canal-transit/canal-transit.component';
import { RestockBunkerComponent } from './Features/rotation/cards/restock-bunker/restock-bunker.component';
import { BunkerOptionComponent } from './Features/bunker-option/bunker-option.component';
import { RotationComponent } from './Features/rotation/rotation.component';
import { PortActivitiesComponent } from './Features/rotation/port-activities/port-activities.component';
import { RotationService } from './Core/Services/rotation.service';
import { ActivityShortComponent } from './Features/rotation/activity/activity-short/activity-short.component';
import { CountryDetailsComponent } from './Features/loctation/country-details/country-details.component';
import { BerthDetailsComponent } from './Features/loctation/berth-details/berth-details.component';
import { PortDetailsComponent } from './Features/loctation/port-details/port-details.component';
import { AgencyComponent } from './Features/loctation/agency/agency.component';
import { AgencyMaskComponent } from './Features/loctation/agency/agency-mask/agency-mask.component';
import { LegPlannerComponent } from './Features/rotation/port-activities/leg-planner/leg-planner.component';
import { PdfMaskComponent } from './Features/utility/pdf-mask/pdf-mask.component';
import { LoaderComponent } from './Features/utility/loader/loader.component';
import { ImportDialogComponent } from './Features/utility/import-dialog/import-dialog.component';
import { InstructionComponent } from './Features/utility/instruction/instruction.component';
import { AboutComponent } from './Features/utility/about/about.component';  

@NgModule({
  declarations: [
    AppComponent,
    RotationComponent,
    LoctationComponent,
    ActivityComponent,
    PortActivitiesComponent,
    SeaPassageComponent,
    PilotingComponent,
    OperationComponent,
    WaitingAtSeaComponent,
    LaybyBerthComponent,
    ShiftingComponent,
    CanalTransitComponent,
    RestockBunkerComponent,
    BunkerOptionComponent,
    ActivityShortComponent,
    CountryDetailsComponent,
    BerthDetailsComponent,
    PortDetailsComponent,
    AgencyComponent,
    AgencyMaskComponent,
    LegPlannerComponent,
    PdfMaskComponent,
    LoaderComponent,
    ImportDialogComponent,
    InstructionComponent,
    AboutComponent, 
  ],
  
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    DateFnsModule.forRoot(),
    FlexLayoutModule, 
    FormsModule,
    ReactiveFormsModule  

  ],
  providers: [MyElectronService, ElectronService, RotationService],
  bootstrap: [AppComponent]
})
export class AppModule { }


