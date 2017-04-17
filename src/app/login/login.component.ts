import { Component }    from '@angular/core';
import { AuthService }  from './auth.service';
import { LoginMessage } from "./LoginMessage";

@Component({
  selector: 'login',
  templateUrl: 'login.template.html'
})

export class LoginComponent {

  private messages: LoginMessage = {errorMessage: '', succesMessage: ''};

  constructor(private authService: AuthService) {}

  allFieldsFilledIn(username, password): boolean {
    if (username == '' && password == '') {
      this.messages.errorMessage = 'Username and password need to be filled in.';
      this.messages.succesMessage = '';
      return false;
    } else if (username == '') {
      this.messages.errorMessage = 'Username need to be filled in.';
      this.messages.succesMessage = '';
      return false;
    } else if (password == '') {
      this.messages.errorMessage = 'Password need to be filled in.';
      this.messages.succesMessage = '';
      return false;
    }
    return true;
  }

  loginWithErrorHandling(username, password) {
    if (this.allFieldsFilledIn(username, password)) {
      this.authService.login(username, password).subscribe(data => {
        console.log('login succes');
        this.messages.errorMessage = '';
        this.messages.succesMessage = '';
      }, err => {
        console.log('login error');
        this.messages.errorMessage = 'An error has occurred while logging in.';
        this.messages.succesMessage = '';
      });
    }
  }

}
