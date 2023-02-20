import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import * as moment from 'moment' ;
import { NzModalService } from 'ng-zorro-antd/modal';

import { JsonDataService } from './service/json-data.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BlogSetting } from './model/blogmodel';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean> | null = null;
  currentTheme = 'Default';
  get currentVersion(): string {
    return environment.version;
  };

  title = '';
  footer = '';
  author = '';
  authordesp = '';
  authorimg = '';
  listCollection: Array<{
    name: string,
    count: number
  }> = [];
  listTag: Array<{
    name: string,
    count: number
  }> = [];
  listMonth: Array<{
    postdate: moment.Moment, // First day of Month
    count: number
  }> = [];

  constructor(private dataService: JsonDataService,
    private modal: NzModalService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this._destroyed$ = new ReplaySubject(1);

    this.route.queryParams.subscribe({
      next: val => {
        if (val['blog']) {
          this.dataService.currentBlog = val['blog'] as string;
          this.loadData();  
        } else {
          // this.modal.error({
          //   nzTitle: 'Error to load data',
          //   nzContent: 'Error to load the data...'
          // });
        }
      },
      error: err => {
        this.modal.error({
          nzTitle: 'Error to load data',
          nzContent: 'Error to load the data...'
        });
    }
    });

    this.dataService.subjectPost.pipe(takeUntil(this._destroyed$)).subscribe({
      next: data => {
        this.listMonth = [];
        this.listCollection = [];
        this.listTag = [];
        data.forEach(val => {
          if (val.createdat) {
            let mday = val.createdat.clone().startOf('M');
            const dtidx = this.listMonth.findIndex(dt => {
              return dt.postdate.isSame(mday);
            });
            if (dtidx === -1) {
              this.listMonth.push({
                postdate: mday,
                count: 1,
              });
            } else {
              this.listMonth[dtidx].count ++;
            }
          }
          if (val.tags.length > 0) {
            val.tags.forEach(tag => {
              const cidx = this.listTag.findIndex(ctg => {
                return tag === ctg.name;
              });
              if (cidx === -1) {
                this.listTag.push({
                  name: tag,
                  count: 1
                });
              } else {
                this.listTag[cidx].count ++;
              }
            });
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

  private loadData() {
    forkJoin([
      this.dataService.readPost(),
      this.dataService.readSetting()
    ]).subscribe({
      next: () => {
        // Do nothing
      },
      error: err => {
        console.error(err);
      }
    });
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
