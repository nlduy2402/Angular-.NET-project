import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedService } from './shared.service';
import { BrowserModule } from '@angular/platform-browser';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { NotificationComponent } from './components/modals/notification/notification.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, ReactiveFormsModule,NotificationComponent],
  providers: [SharedService],
  exports: [RouterModule,CommonModule]
})
export class SharedModule {}
