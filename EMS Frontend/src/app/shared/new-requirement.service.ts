import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewRequirement } from '../model/newrequirement';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewRequirementService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getNewRequirements(): Observable<NewRequirement[]> {
    return this.http.get<NewRequirement[]>(`${this.apiServerUrl}/new-requirements/all`, { withCredentials: true });
  }

  public addNewRequirement(newRequirement: NewRequirement): Observable<NewRequirement> {
    return this.http.post<NewRequirement>(`${this.apiServerUrl}/new-requirements/add`, newRequirement, { withCredentials: true });
  }

  public updateNewRequirement(newRequirement: NewRequirement): Observable<NewRequirement> {
    return this.http.put<NewRequirement>(`${this.apiServerUrl}/new-requirements/update`, newRequirement, { withCredentials: true });
  }

  public deleteNewRequirement(newRequirementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/new-requirements/delete/${newRequirementId}`, { withCredentials: true });
  }

  public uploadNewRequirements(newRequirements: NewRequirement[]): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/new-requirements/bulk`, newRequirements, { withCredentials: true });
  }

  private newRequirementCountSubject = new BehaviorSubject<number>(0);
  newRequirementCount$ = this.newRequirementCountSubject.asObservable();
  updateNewRequirementCount(count: number) {
    this.newRequirementCountSubject.next(count);
  }

}
