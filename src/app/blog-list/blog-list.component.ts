import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { JsonDataService } from '../service/json-data.service';
import { BlogPost } from '../model/blogmodel';
import * as moment from 'moment';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.less']
})
export class BlogListComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: variable-name
  private _destroyed$: ReplaySubject<boolean>;
  listPosts: BlogPost[] = [];
  private navpath = '';
  private navcriteria = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: JsonDataService) { }

  ngOnInit(): void {
    this._destroyed$ = new ReplaySubject(1);
    this.dataService.subjectPost
    .pipe(takeUntil(this._destroyed$))
    .subscribe({
      next: data => {
        this.listPosts = [];
        if (this.navpath === 'blogbycoll') {
          data.forEach(val => {
            if (val.collection.includes(this.navcriteria)) {
              this.listPosts.push(val);
            }
          });
        } else if(this.navpath === 'blogbydate') {
          const dateinfo = moment(this.navcriteria, 'YYYY-MM-DD');
          data.forEach(val => {
            if (val.createdat.clone().startOf('D').isSame(dateinfo)) {
              this.listPosts.push(val);
            }
          });
        }
      }
    });

    this.activateRoute.url.subscribe({
      next: x => {
        if (x instanceof Array && x.length > 0) {
          this.navpath = x[0].path;
          this.navcriteria = x[1].path;
        }

        this.dataService.readPost().subscribe();
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
