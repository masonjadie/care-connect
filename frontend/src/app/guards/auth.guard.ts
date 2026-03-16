import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean | UrlTree {
        const user = localStorage.getItem('careconnect_user');
        if (user) {
            return true;
        }
        return this.router.parseUrl('/auth');
    }
}
