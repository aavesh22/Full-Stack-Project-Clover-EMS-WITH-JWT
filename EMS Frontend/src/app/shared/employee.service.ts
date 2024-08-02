import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiServerUrl}/employees/all`, { withCredentials: true });
  }

  public addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiServerUrl}/employees/add`, employee, { withCredentials: true });
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiServerUrl}/employees/update`, employee, { withCredentials: true });
  }

  public deleteEmployee(employeeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/employees/delete/${employeeId}`, { withCredentials: true });
  }

  public uploadEmployees(employees: Employee[]): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/employees/bulk`, employees, { withCredentials: true });
  }

  private benchCountSubject = new BehaviorSubject<number>(0);
  benchCount$ = this.benchCountSubject.asObservable();
  updateBenchCount(count: number) {
    this.benchCountSubject.next(count);
  }
}
