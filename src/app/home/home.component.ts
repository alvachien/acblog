import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { JsonDataService } from '../service/json-data.service';
import { BlogPost } from '../model/blogmodel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean> | null = null;
  listPosts: BlogPost[] = [];
  queryParams: any = {};

  constructor(private dataService: JsonDataService,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this._destroyed$ = new ReplaySubject(1);

    this.route.queryParams.subscribe({
      next: val => {
        if (val['blog']) {
          this.queryParams['blog'] = this.dataService.currentBlog;
        } else {
        }
      },
      error: err => {
        // Do nothing
      }
    });

    this.dataService.subjectPost
      .pipe(takeUntil(this._destroyed$))
      .subscribe({
      next: data => {
        this.listPosts = data.slice();
      }
    });
  }

  ngOnDestroy() {
    if (this._destroyed$) {
      this._destroyed$.next(true);
      this._destroyed$.complete();
    }
  }
}
