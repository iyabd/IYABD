import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLogin implements OnInit {
  router = inject(Router);

  ngOnInit() {
    // Redirect to the unified login page
    this.router.navigate(['/my-account']);
  }
}
