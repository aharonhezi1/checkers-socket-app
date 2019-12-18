import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../login/login.service';


@Injectable({
  providedIn: 'root'
})

export class UsersApiService {

  constructor(private http: HttpClient, private loginService: LoginService) { }
  url = this.loginService.url;
  getUsers() {
    return this.http.get(this.url + '/api/users');
  }
  // getLoginUsers(){
  //   return this.http.get(this.url + '/api/users');

  // }

}
