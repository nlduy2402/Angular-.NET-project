import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/User';
import { ConfirmEmail } from '../../shared/models/account/Email';
import { NotificationComponent } from '../../shared/components/modals/notification/notification.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, NotificationComponent, RouterLinkActive, RouterLink],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css',
})
export class ConfirmEmailComponent implements OnInit {
  success: boolean = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}
  @ViewChild(NotificationComponent) notification?: NotificationComponent;
  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        } else {
          this.activeRoute.queryParamMap.subscribe({
            next: (params: any) => {
              console.log(params.get('token'));
              console.log(params.get('email'));
              const confirmEmail: ConfirmEmail = {
                token: params.get('token'),
                email: params.get('email'),
              };
              this.accountService.confirmEmail(confirmEmail).subscribe({
                next: (response: any) => {
                  this.notification?.openModal(
                    true,
                    response.value.title,
                    response.value.message
                  );
                },
                error: (errors) => {
                  this.success = false;
                  this.notification?.openModal(
                    false,
                    'Fail to confirm',
                    errors.error
                  );
                },
              });
            },
          });
        }
      },
    });
  }

  resendEmailConfirmationLink() {
    this.router.navigateByUrl(
      '/account/send-email/resend-email-confirmation-link'
    );
  }
}
