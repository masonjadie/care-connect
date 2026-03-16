import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-overlay',
  templateUrl: './auth-overlay.component.html',
  styleUrls: ['./auth-overlay.component.scss']
})
export class AuthOverlayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('careconnect_user');
  }

}
