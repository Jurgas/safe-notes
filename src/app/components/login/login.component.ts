import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthRequest} from '../../models/auth-request.model';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';

const ATTEMPTS_NUMBER = 3;
const COUNTER_NUMBER = 30;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('.{4,}')]),
    password: new FormControl('', [Validators.required, Validators.pattern('.{8,}')]),
  });

  loading = false;
  attempts = ATTEMPTS_NUMBER;
  counter = COUNTER_NUMBER;
  tooManyAttempts = false;
  error = false;
  interval: number;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginFormGroup.valid) {
      this.loading = true;
      const data: AuthRequest = {
        username: this.loginFormGroup.get('username').value,
        password: this.loginFormGroup.get('password').value,
      };
      this.authService.login(data).subscribe(() => {
        this.loading = false;
        this.router.navigate(['/home']);
      }, () => {
        this.loading = false;
        this.error = true;
        this.calculateAttempts();
      });
    }
  }

  calculateAttempts(): void {
    this.attempts--;
    if (this.attempts === 0) {
      this.interval = setInterval(() => this.counter--, 1000);
      this.error = false;
      this.tooManyAttempts = true;
      setTimeout(() => {
        this.tooManyAttempts = false;
        clearInterval(this.interval);
        this.attempts = ATTEMPTS_NUMBER;
      }, COUNTER_NUMBER * 1000);
    }
  }
}
