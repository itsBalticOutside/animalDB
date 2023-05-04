import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements CanActivate {
  showLoginForm: boolean = true;


  constructor(
    private router: Router
  ) {}

  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isAuthenticated()) {
      // user is authenticated, allow access to the requested route
      return true;
    }

    // user is not authenticated, redirect to the home page
    this.router.navigate(['']);
    return false;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // return true if token exists, false otherwise
  }
}
