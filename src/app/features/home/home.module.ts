import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeHeaderComponent } from './home-header.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    HomeHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }

