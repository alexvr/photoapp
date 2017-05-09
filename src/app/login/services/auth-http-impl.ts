import {AuthConfig, AuthHttp, JwtHelper} from 'angular2-jwt';
import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthHttpImpl {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http) {
  }

  getAuthHttp(): AuthHttp {
    const tokenValue = localStorage.getItem('id_token');
    console.log('AuthHttpImpl - Token found in localStorage: ' + tokenValue);
    console.log(
      this.jwtHelper.decodeToken(tokenValue),
      this.jwtHelper.getTokenExpirationDate(tokenValue),
      this.jwtHelper.isTokenExpired(tokenValue)
    );

    if (tokenValue.length > 0) {
      return new AuthHttp(new AuthConfig({
        globalHeaders: [
          {'token': tokenValue}
        ]
      }), this.http);
    } else {
      console.log('returning authHttp without token');
    }
  }

}
