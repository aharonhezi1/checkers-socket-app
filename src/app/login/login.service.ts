import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url = 'http://localhost:3030';
//  users = new BehaviorSubject<any>(null);
  errorMessage;
  users=new BehaviorSubject<any>(null);

  isLogin = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private socket: Socket) { }
  loginUser(user) {
    // return this.http.post(this.url + '/api/users/login', user).subscribe(res => {
    //   this.users.next(res);
    //   this.isLogin.next(true)
    // }, error =>
    //   this.errorMessage = 'Unauthorized user!'
    // );
    this.socket.emit('login',user)

  }
  signUpUser(user) {
    return this.http.post(this.url + '/api/users/signup', user);

  }

}
