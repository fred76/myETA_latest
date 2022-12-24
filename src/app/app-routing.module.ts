import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { BunkerOptionComponent } from './Features/bunker-option/bunker-option.component';
import { LoctationComponent } from './Features/loctation/loctation.component';  
import { RotationComponent } from './Features/rotation/rotation.component';
import { InstructionComponent } from './Features/utility/instruction/instruction.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  }, 
  {
    path: 'location',
    component: LoctationComponent,
  }, 
  {
    path: 'home',
    component: RotationComponent,
  }, 
  {
    path: 'bunker',
    component: BunkerOptionComponent,
  },  
  {
    path: 'instruction',
    component: InstructionComponent,
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}