import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Replacement } from '../model/replacement';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReplacementService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getReplacements(): Observable<Replacement[]> {
    return this.http.get<Replacement[]>(`${this.apiServerUrl}/replacements/all`, { withCredentials: true });
  }

  public addReplacement(replacement: Replacement): Observable<Replacement> {
    return this.http.post<Replacement>(`${this.apiServerUrl}/replacements/add`, replacement, { withCredentials: true });
  }

  public updateReplacement(replacement: Replacement): Observable<Replacement> {
    return this.http.put<Replacement>(`${this.apiServerUrl}/replacements/update`, replacement, { withCredentials: true });
  }

  public deleteReplacement(replacementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/replacements/delete/${replacementId}`, { withCredentials: true });
  }

  public uploadReplacement(replacement: Replacement[]): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/replacements/bulk`, replacement, { withCredentials: true });
  }
  
  private replacementCountSubject = new BehaviorSubject<number>(0);
  replacementCount$ = this.replacementCountSubject.asObservable();
  updateReplacementCount(count: number) {
    this.replacementCountSubject.next(count);
  }
}
