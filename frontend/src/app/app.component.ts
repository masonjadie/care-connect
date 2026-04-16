import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loadChat = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        // Defer tracking slightly to avoid blocking main thread on boot
        setTimeout(() => {
          this.analyticsService.trackVisit(url).subscribe();
        }, 3000);
      }),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(event => {
      const title = event['title'] || 'CareConnect Hub';
      this.titleService.setTitle(title);
    });

    // Defer non-critical components to improve LCP and TBT
    // We wait 6 seconds to ensure it loads well after the initial measuring window
    setTimeout(() => {
      this.loadChat = true;
    }, 6000);
  }
}
