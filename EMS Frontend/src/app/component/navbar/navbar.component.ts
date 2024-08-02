import { Component, Input } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) { }


  toggleSearch(event: Event) {
    event.preventDefault();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
    let table = document.getElementsByClassName('table')
    table[0].classList.toggle('table-dark')
  }


  logout() {
    this.authService.logout().subscribe(
      success => {
        if (success) {
          this.router.navigate(['/login']);
        } else {
          console.error('Logout failed');
        }
      }
    );
  }
}