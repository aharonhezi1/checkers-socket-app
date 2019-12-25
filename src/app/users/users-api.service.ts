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
  incrementNumOfGamesAndWins(isGames, isWins) {
    let myProfile;
    this.loginService.myProfile.subscribe(profile => myProfile = profile);
    myProfile = { ...myProfile, isGames, isWins }
    return this.http.patch(this.url + '/api/users/increment', myProfile)
  }
  // getLoginUsers(){
  //   return this.http.get(this.url + '/api/users');

  // }

}
