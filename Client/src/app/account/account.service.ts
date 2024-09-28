import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from '../shared/models/account/Register';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/account/Login';
import { User } from '../shared/models/account/User';
import { map, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from '../shared/models/account/Email';
import { ResetPassword } from '../shared/models/account/ResetPassword';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private userSrc = new ReplaySubject<User | null>(1);
  user$ = this.userSrc.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(model: Register) {
    return this.http.post(`${environment.appUrl}/api/account/register`, model);
  }

  confirmEmail(model: ConfirmEmail) {
    return this.http.put(
      `${environment.appUrl}/api/account/confirm-email`,
      model
    );
  }

  resendEmailConfirmationLink(email: string) {
    return this.http.post(
      `${environment.appUrl}/api/account/resend-email-confirmation-link/${email}`,
      {}
    );
  }

  resetPassword(model: ResetPassword) {
    return this.http.put(
      `${environment.appUrl}/api/account/reset-password`,
      model
    );
  }

  ForgotUsernameOrPassword(email: string) {
    return this.http.post(
      `${environment.appUrl}/api/account/forgot-username-or-password/${email}`,
      {}
    );
  }

  refreshUser(JWT: string | null) {
    if (JWT === null) {
      this.userSrc.next(null);
      return of(undefined);
    } else {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT}`,
      });
      let refreshToken = this.http
        .get<User>(`${environment.appUrl}/api/account/refresh-token`, {
          headers,
        })
        .pipe(
          map((user: User) => {
            if (user) {
              this.setUser(user);
            }
          })
        );
      return refreshToken;
    }
  }

  login(model: Login) {
    return this.http
      .post<User>(`${environment.appUrl}/api/account/login`, model)
      .pipe(
        map((user: User) => {
          if (user) {
            this.setUser(user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.userKey);
    this.userSrc.next(null);
    this.router.navigateByUrl('/');
  }

  getJWT() {
    const key = localStorage.getItem(environment.userKey);
    if (key) {
      const user: User = JSON.parse(key);
      return user.jwt;
    } else {
      return null;
    }
  }

  private setUser(user: User) {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSrc.next(user);
  }
}
