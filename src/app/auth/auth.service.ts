import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http' //HttpClient for sending POST request to the Express server that handles authentication
import { tap } from  'rxjs/operators';//The tap() operator for performing side effects when subscribing to the observables returned by the HttpClient methods,
import { Observable, BehaviorSubject } from  'rxjs';//The Observable, BehaviorSubject APIs for working with asynchronous operations,

import { Storage } from  '@ionic/storage'; //The Storage module for persisting the access token and expiration date in the local storage
import { User } from  './user';
import { AuthResponse } from  './auth-response' //The User and AuthResponse interfaces.

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_SERVER_ADDRESS:  string  =  'http://localhost:3000';
   authSubject  =  new  BehaviorSubject(false);

  constructor(private  httpClient:  HttpClient, private  storage:  Storage) { }

  register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/register`, user).pipe(
      tap(async (res:  AuthResponse ) => { // pipe() function to chain multiple operators. In our case we want to perform a side effect for storing JWT information (the access token and expiration date) in the local storage so we use the tap() operator that't available from RxJS.
//We simply use the post() method to send a POST request to the /register endpoint exposed by our authentication server that will be running from the localhost:3000/ address
//The AUTH_SERVER_ADDRESS holds the address of the Express authentication server and authSubject is a type of Observable that will be used to subscribe to the authentication state

        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.user.access_token);
          await this.storage.set("EXPIRES_IN", res.user.expires_in);
          this.authSubject.next(true);
        }
      })

    );
  }
  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/login`, user).pipe(
      tap(async (res: AuthResponse) => {

        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.user.access_token);
          await this.storage.set("EXPIRES_IN", res.user.expires_in);
          this.authSubject.next(true);
        }
      })
    );
  }
  async logout() {
    await this.storage.remove("ACCESS_TOKEN");
    await this.storage.remove("EXPIRES_IN");
    this.authSubject.next(false);
  }
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
