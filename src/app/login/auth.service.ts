import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router }          from '@angular/router';
import { Observable }      from "rxjs/Observable";

// Avoid name not found warnings
declare let auth0: any;
let Auth0Lock = require('auth0-lock').default;

/**
 * This service is used for User authentication.
 * Build with Auth0 and JWT.
 */
@Injectable()
export class AuthService {

  // Configure Auth0
  auth0 = new auth0.WebAuth({
    domain: 'globeshanghai.au.auth0.com',
    clientID: 'oGa4il3EPpAPkuY686B28fhNea02-21P',
    // specify your desired callback URL
    redirectUri: 'http://localhost:4200',
    responseType: 'token id_token'
  });

  // Configure Auth0Lock
  lock = new Auth0Lock('oGa4il3EPpAPkuY686B28fhNea02-21P', 'globeshanghai.au.auth0.com', {});

  constructor(private router: Router) {
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
    });
  }

  /**
   * Get the authentication result from the URL.
   */
  public handleAuthentication(): void {
    this.auth0.parseHash({ _idTokenVerification: false }, (err, authResult) => {
      if (err) {
        alert(`Error: ${err.errorDescription}`)
      }
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        this.router.navigate(['/event-overview']);
      }
    });
  }

  /**
   * Login with username and password.
   * If successful the id token and access token will be stored in local storage.
   * @param username
   * @param password
   * @returns {Observable}
   */
  public login(username: string, password: string): Observable<any> {
    return new Observable(obs => this.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username,
      password
    }, (err, authResult) => {
      if (err) {
        return obs.error();
      }
      else if (authResult && authResult.idToken && authResult.accessToken) {
        this.setUser(authResult);
        this.router.navigate(['/event-overview']);
        return obs.complete();
      }
    }));
  }

  // TODO: Is signup necessary?
  /**
   * Sign up with email and password.
   * @param email
   * @param password
   * @returns {Observable}
   */
  public signup(email: string, password: string): Observable<any> {
    return new Observable(obs => this.auth0.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email,
      password,
    }, (err) => {
      if (err) {
        return obs.error();
      }
      return obs.complete();
    }));
  }

  /**
   * Check for the User's authentication state based on the id_token's expiry time.
   * @returns {boolean}
   */
  public isAuthenticated(): boolean {
    // Check whether the id_token is expired or not
    return tokenNotExpired();
  }

  /**
   * Logs out the current user. Acces token and id token in local storage will be removed.
   */
  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  }

  /**
   * Set acces token and id token in local storage.
   * @param authResult
   */
  private setUser(authResult): void {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }
}
