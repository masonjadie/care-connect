import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.breadcrumbs = this.buildBreadcrumbs(event.urlAfterRedirects);
      });
      
    // Initialize for the first time
    this.breadcrumbs = this.buildBreadcrumbs(this.router.url);
  }

  buildBreadcrumbs(url: string): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];
    let currentUrl = '';
    
    // Ignore query params and hash
    const urlWithoutParams = url.split('?')[0].split('#')[0];
    const pathSegments = urlWithoutParams.split('/').filter(segment => segment.length > 0);

    // If we're on the home page, don't show breadcrumbs
    if (pathSegments.length === 0) {
      return [];
    }

    breadcrumbs.push({ label: 'Home', url: '/' });

    pathSegments.forEach((segment) => {
      currentUrl += `/${segment}`;
      
      // Basic formatting: "meal-delivery" -> "Meal Delivery"
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label: label,
        url: currentUrl
      });
    });

    return breadcrumbs;
  }
}
