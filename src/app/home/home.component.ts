import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { JsonDataService } from '../service/json-data.service';
import { BlogPost } from '../model/blogmodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: variable-name
  private _destroyed$: ReplaySubject<boolean>;
  listPosts: BlogPost[] = [];

  constructor(public dataService: JsonDataService) {
  }

  ngOnInit(): void {
    this._destroyed$ = new ReplaySubject(1);

    this.dataService.subjectPost.pipe(takeUntil(this._destroyed$)).subscribe({
      next: data => {
        this.listPosts = data.slice();
      }
    })
  }

  ngOnDestroy() {
    console.log("app.home.ondestroy");
    if (this._destroyed$) {
      this._destroyed$.next(true);
      this._destroyed$.complete();
    }
  }
}
