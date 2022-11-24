import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BunkerOptionComponent } from './Features/bunker-option/bunker-option.component';
import { LoctationComponent } from './Features/loctation/loctation.component';  
import { RotationComponent } from './Features/rotation/rotation.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'location',
  }, 
  {
    path: 'home',
    component: RotationComponent,
  }, 
  {
    path: 'location',
    component: LoctationComponent,
  }, 
  {
    path: 'bunker',
    component: BunkerOptionComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}