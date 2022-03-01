import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  password: string = '';

  constructor(private router: Router) { }

  verifyPassword(password: string) {
    const actualPassword = environment.password;
    return password === actualPassword;
  }

  enterApp() {
    if (!this.verifyPassword(this.password)) {
      alert('Password is incorrect');
      return;
    }
    localStorage.setItem('loggedIn', 'T');
    this.router.navigate(['/mint']);
  }

}
