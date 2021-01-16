import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';
import {AuthRequestRegister} from '../../models/auth-request.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('.{4,}')]),
    password: new FormControl('', [Validators.required, Validators.pattern('.{8,}')]),
    email: new FormControl('', [Validators.required, Validators.pattern('(?:[A-Za-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-Za-z0-9-]*[A-Za-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')]),
  });

  loading = false;
  passwordDetails = false;
  entropy = 0;
  strength: string;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.registerFormGroup.get('password').valueChanges.subscribe((val) => {
      this.calculateEntropy(val);
      this.passwordDetails = this.registerFormGroup.get('password').value.length > 0;
    });
  }

  onSubmit(): void {
    if (this.registerFormGroup.valid) {
      this.loading = true;
      const data: AuthRequestRegister = {
        username: this.registerFormGroup.get('username').value,
        password: this.registerFormGroup.get('password').value,
        email: this.registerFormGroup.get('email').value,
      };
      this.authService.register(data).subscribe(() => {
        this.loading = false;
        this.router.navigate(['/login']);
      }, () => {
        this.loading = false;
      });
    }
  }

  private calculateEntropy(str: string): void {
    const stat = {};
    str.split('').forEach(
      c => (stat[c] ? stat[c]++ : stat[c] = 1)
    );
    this.entropy = Object.keys(stat).reduce((H, c) => {
      const p = stat[c] / str.length;
      return H + (p * Math.log2(1 / p));
    }, 0);
    this.entropy = Math.round(this.entropy * 1000) / 1000;
    if (this.entropy < 2.5){
      this.strength = 'weak';
    } else if (this.entropy < 3.5) {
      this.strength = 'medium';
    } else {
      this.strength = 'strong';
    }
  }
}
