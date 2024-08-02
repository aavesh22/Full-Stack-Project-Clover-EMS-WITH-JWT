import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiServerUrl = environment.apiBaseUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return null;
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/auth/register`, user, { withCredentials: true });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        map(user => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout(): Observable<boolean> {
    return this.http.post(`${this.apiServerUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
        return true;
      }),
      catchError(error => {
        console.error('Logout failed', error);
        return of(false);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    if (this.currentUserSubject.value) {
      return of(true);
    }
    return this.http.get<any>(`${this.apiServerUrl}/auth/currentUser`, { withCredentials: true }).pipe(
      map(user => {
        if (user) {
          this.currentUserSubject.next(user);
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }
}
