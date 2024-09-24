import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationComponent } from "../../shared/components/modals/notification/notification.component";
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NotificationComponent, ReactiveFormsModule, NotificationComponent,ValidationMessagesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = []; //
  @ViewChild(NotificationComponent) notification?: NotificationComponent;   
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.submitted = true;
    this.errorMessages = [];

    //if (this.loginForm.valid) {
      this.accountService.register(this.loginForm.value).subscribe({
        next: (response: any) => {
          // this.notification?.openModal(
          //   true,
          //   response.value.title,
          //   response.value.message
          // );
          // setTimeout(() => {
          //   this.router.navigateByUrl('/account/login');
          // }, 2500);
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error);
          }
        },
      });
    //}
  }
}
