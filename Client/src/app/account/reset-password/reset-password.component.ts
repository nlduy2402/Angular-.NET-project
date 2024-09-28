import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationComponent } from '../../shared/components/modals/notification/notification.component';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';
import { User } from '../../shared/models/account/User';
import { ResetPassword } from '../../shared/models/account/ResetPassword';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    NotificationComponent,
    ValidationMessagesComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  success: boolean = false;
  email: string | undefined;
  token: string | undefined;

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
          this.activeRoute.queryParamMap.subscribe({
            next: (params: any) => {
              this.email = params.get('email');
              this.token = params.get('token');
            },
          });
          if (this.token && this.email) {
            this.initializeForm(this.email);
          } else {
            this.router.navigateByUrl('/account/login');
          }
        }
      },
    });
  }

  initializeForm(username: string) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [
        {
          value: username,
          disabled: true,
        },
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  ResetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.resetPasswordForm.valid && this.email && this.token) {
      const resetPassword: ResetPassword = {
        token: this.token,
        email: this.email,
        newpassword: this.resetPasswordForm.get('newPassword')?.value
      };
      console.log(resetPassword);
      this.accountService.resetPassword(resetPassword).subscribe({
        next: (response: any) => {
          this.notification?.openModal(
            true,
            response.value.title,
            response.value.message
          );
          setTimeout(() => {
            this.router.navigateByUrl('/account/login');
          }, 2500);
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

    console.log(this.resetPasswordForm.value);
  }
}
