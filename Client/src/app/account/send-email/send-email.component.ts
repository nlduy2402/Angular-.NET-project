import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/models/account/User';
import { take } from 'rxjs';
import { NotFoundComponent } from '../../shared/components/errors/not-found/not-found.component';
import { NotificationComponent } from '../../shared/components/modals/notification/notification.component';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [
    NotificationComponent,
    CommonModule,
    ReactiveFormsModule,
    ValidationMessagesComponent,
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css',
})
export class SendEmailComponent implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  mode: string | undefined;
  errorMessages: string[] = [];

  @ViewChild(NotificationComponent) notification?: NotificationComponent;
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          const mode = this.activeRoute.snapshot.paramMap.get('mode');
          if (mode) {
            this.mode = mode;
            console.log(mode);
            this.initializeForm();
          }
        }
      }
    });
  }

  initializeForm() {
    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        ],
      ],
    });
  }

  resendEmailConfirmationLink() {
    this.router.navigateByUrl(
      '/account/send-email/resend-email-confirmation-link'
    );
  }

  sendEmail() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.emailForm.valid && this.mode) {
      if (this.mode.includes('resend-email-confirmation-link')) {
          this.accountService
            .resendEmailConfirmationLink(this.emailForm.get('email')?.value)
            .subscribe({
              next: (response: any) => {
                this.notification?.openModal(
                  true,
                  response.value.title,
                  response.value.message
                );
                setTimeout(() => {
                  this.router.navigateByUrl('/account/login');
                }, 1500);
              },
              error: (error) => {
                if (error.error.errors) {
                  this.errorMessages = error.error.errors;
                } else {
                  this.errorMessages.push(error.error);
                }
              }
            });
      } else if(this.mode.includes('forgot-username-or-password')) {
        this.accountService
          .ForgotUsernameOrPassword(this.emailForm.get('email')?.value)
          .subscribe({
            next: (response: any) => {
              this.notification?.openModal(
                true,
                response.value.title,
                response.value.message
              );
              setTimeout(() => {
                this.router.navigateByUrl('/account/login');
              }, 2000);
            },
            error: (error) => {
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }

    }
  }
}
