import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsidePageRoutingModule } from './inside-routing.module';

import { InsidePage } from './inside.page';
import { ProfileComponent } from '../profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsidePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [InsidePage, ProfileComponent],
})
export class InsidePageModule {}
