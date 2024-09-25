import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared.module';
import { SharedService } from '../../../shared.service';

//  @ts-ignore
const $: any = window['$']
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  providers: [SharedModule]
})
export class NotificationComponent {
  @ViewChild('modal') modal?: ElementRef;
  isSuccess: boolean = true;
  title: string = '';
  message: string = '';
  constructor(public bsModalRef: BsModalRef) {}

  openModal(isSuccess: boolean, title: string, message: string) {
    this.isSuccess = isSuccess;
    this.title = title;
    this.message = message;
    $(this.modal?.nativeElement).modal('show');
    setTimeout(() => {
      $(this.modal?.nativeElement).modal('hide');
    }, 2000); 
    
  }

}
