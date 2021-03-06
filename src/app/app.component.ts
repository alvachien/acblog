import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import * as moment from 'moment' ;

import { JsonDataService } from './service/json-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line: variable-name
  private _destroyed$: ReplaySubject<boolean>;
  currentTheme = 'Default';

  title = '';
  footer = '';
  author = '';
  authordesp = '';
  authorimg = '';
  listCollection: Array<{
    name: string,
    count: number
  }> = [];
  listDate: Array<{
    postdate: moment.Moment,
    count: number
  }> = [];

  constructor(private dataService: JsonDataService) {
  }

  ngOnInit() {
    this._destroyed$ = new ReplaySubject(1);

    forkJoin([
      this.dataService.readPost(),
      this.dataService.readSetting()
    ]).subscribe({
      next: rtns => {
        // Do nothing
      },
      error: err => {
        console.error(err);
      }
    });

    this.dataService.subjectPost.pipe(takeUntil(this._destroyed$)).subscribe({
      next: data => {
        this.listDate = [];
        this.listCollection = [];
        data.forEach(val => {
          if (val.createdat) {
            const dtidx = this.listDate.findIndex(dt => {
              return dt.postdate.isSame(val.createdat.clone().startOf('D'));
            });
            if (dtidx === -1) {
              this.listDate.push({
                postdate: val.createdat.clone().startOf('D'),
                count: 1,
              });
            } else {
              this.listDate[dtidx].count ++;
            }
          }
          if (val.collection.length > 0) {
            val.collection.forEach(col => {
              const cidx = this.listCollection.findIndex(coll => {
                return col === coll.name;
              });
              if (cidx === -1) {
                this.listCollection.push({
                  name: col,
                  count: 1
                });
              } else {
                this.listCollection[cidx].count ++;
              }
            });
          }
        });
      }
    });

    this.dataService.subjectSetting.pipe(takeUntil(this._destroyed$)).subscribe({
      next: data => {
        if (data !== undefined) {
          this.title = data.title;
          this.footer = data.footer;
          this.author = data.author;
          this.authordesp = data.author;
          this.authorimg = data.authorimg;

          document.title = data.title; // Update title
        }
      }
    });
  }
  ngOnDestroy() {
    if (this._destroyed$) {
      this._destroyed$.next(true);
      this._destroyed$.complete();
    }
  }

  onChangeTheme() {
    if (this.currentTheme === 'Default') {
      this.currentTheme = 'Dark';
      this.changeTheme('dark');
    } else if (this.currentTheme === 'Dark') {
      this.currentTheme = 'Compact';
      this.changeTheme('compact');
    } else if (this.currentTheme === 'Compact') {
      this.currentTheme = 'Default';
      this.changeTheme('default');
    }
  }
  private changeTheme(theme: 'default' | 'dark' | 'compact'): void {
    if (theme === 'dark') {
      const dom = document.getElementById('compact-theme');
      if (dom) {
        dom.remove();
      }

      const style = document.createElement('link');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.id = 'dark-theme';
      style.href = 'assets/themes/style.dark.css';
      document.body.appendChild(style);
    } else if (theme === 'compact') {
      const dom = document.getElementById('dark-theme');
      if (dom) {
        dom.remove();
      }

      const style = document.createElement('link');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.id = 'compact-theme';
      style.href = 'assets/themes/style.compact.css';
      document.body.appendChild(style);
    } else {
      const dom = document.getElementById('dark-theme');
      if (dom) {
        dom.remove();
      }
      const dom2 = document.getElementById('compact-theme');
      if (dom2) {
        dom2.remove();
      }
    }
  }
}
