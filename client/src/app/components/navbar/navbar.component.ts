import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterLink } from '@angular/router';
import { AuthUser } from '../../models/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NzPageHeaderModule,
    NzButtonModule,
    NzMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAdmin: Boolean = false;
  authUser?: AuthUser;

  constructor(public authService: AuthService) {
    if (!this.authUser)
      this.authService.authUser$.subscribe(user => {
        this.authUser = user
        this.isAdmin = user?.role === 'admin'
      });
  }

  ngOnInit(): void {
    this.authService.isUserLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
}
