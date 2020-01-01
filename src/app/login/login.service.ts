import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { EnvService } from '../env.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  myProfile = new BehaviorSubject<any>(null);

  url = environment.apiUrl+':'+environment.port
 // url='http://localhost:3030';
  //  users = new BehaviorSubject<any>(null);
  errorMessage=new  BehaviorSubject<string>('');
  users = new BehaviorSubject<any>(null);

  isLogin = new BehaviorSubject<boolean>(false);
  constructor(
    private env: EnvService,
    private http: HttpClient, private socket: Socket
  ) { }
  loginUser(user) {

    this.socket.emit('login', user)

  }
  signUpUser(user) {
    return this.http.post(this.url + '/api/users/signup', user);

  }

}
