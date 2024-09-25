import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  constructor(private http: HttpClient, public accountService:AccountService) {}

  getUser() {
    const jwt = this.accountService.getJWT();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    });
    return this.http.get(`${environment.appUrl}/api/user/get-user`,{headers});
  }
}
