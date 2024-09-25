import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from '../shared/models/Register';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/Login';
import { User } from '../shared/models/User';
import { map, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

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

  refreshUser(JWT: string | null) {
    if (JWT === null) {
      this.userSrc.next(null);
      return of(undefined);
    } else {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT}`
      });
      let refreshToken = this.http
        .get<User>(`${environment.appUrl}/api/account/refresh-token`, {headers})
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
