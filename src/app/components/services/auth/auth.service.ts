import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthRequest, AuthRequestRegister} from '../../../models/auth-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly token = 'access_token';

  constructor(private http: HttpClient,
              private router: Router) {
  }

  static getToken(): string {
    return localStorage.getItem(AuthService.token);
  }

  register(request: AuthRequestRegister): Observable<any> {
    const link = environment.API_URL + '/auth/register';
    const data = {
      username: request.username,
      email: request.email,
      password: request.password,
    };
    return this.http.post<any>(link, data);
  }

  login(request: AuthRequest): Observable<any> {
    const link = environment.API_URL + '/auth/login';
    const data = {
      username: request.username,
      password: request.password,
    };
    return this.http.post<any>(link, data).pipe(
      map(res => {
        localStorage.setItem(AuthService.token, res.accessToken);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AuthService.token);
    this.router.navigate(['/login']);
  }

}
