import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginMessage } from './LoginMessage';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent {

  private messages: LoginMessage = {errorMessage: '', succesMessage: ''};

  constructor(public authService: AuthService) {}

  /**
   * Checks if the username and password are correctly filled in.
   * @param username
   * @param password
   * @returns {boolean}
   */
  allFieldsFilledIn(username, password): boolean {
    if (username == '' && password == '') {
      this.messages.errorMessage = 'Username and password need to be filled in!';
      this.messages.succesMessage = '';
      return false;
    } else if (username == '') {
      this.messages.errorMessage = 'Username need to be filled in!';
      this.messages.succesMessage = '';
      return false;
    } else if (password == '') {
      this.messages.errorMessage = 'Password need to be filled in!';
      this.messages.succesMessage = '';
      return false;
    }
    return true;
  }

  /**
   * Log in with sensible success -and error handling.
   * @param username
   * @param password
   */
  loginWithErrorHandling(username, password) {
    if (this.allFieldsFilledIn(username, password)) {
      this.authService.login(username, password).subscribe(data => {
        console.log('login succes');
        this.messages.errorMessage = '';
        this.messages.succesMessage = '';
      }, err => {
        console.log('login error');
        this.messages.errorMessage = 'An error has occurred while logging in!';
        this.messages.succesMessage = '';
      });
    }
  }

  /**
   * Sign up with sensible success -and error handling.
   * @param username
   * @param password
   */
  signUpWithErrorHandling(username, password) {
    if (this.allFieldsFilledIn(username, password)) {
      this.authService.signup(username, password).subscribe(data => {
          console.log('signup succes');
          this.messages.errorMessage = '';
          this.messages.succesMessage = 'New user is created!';
        }, err => {
          console.log('signup error');
          this.messages.errorMessage = 'The user already exists!';
          this.messages.succesMessage = '';
        }
      );
    }
  }

}
