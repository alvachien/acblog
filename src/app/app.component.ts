import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import * as moment from 'moment' ;
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { translate, TranslocoService } from '@ngneat/transloco';

import { JsonDataService } from './service/json-data.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BlogUtility } from './model/blogmodel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean> | null = null;
  currentTheme = 'Theme.Default';
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
  queryParams: any = {};

  constructor(private dataService: JsonDataService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private i18n: NzI18nService,
    private translocoService: TranslocoService,) {
  }

  ngOnInit() {
    this._destroyed$ = new ReplaySubject(1);

    this.route.queryParams.subscribe({
      next: val => {
        if (val['blog']) {
          this.dataService.currentBlog = val['blog'] as string;
          this.queryParams['blog'] = this.dataService.currentBlog;
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
          nzContent: err.toString()
        });
      }
    });

    this.dataService.subjectPost.pipe(takeUntil(this._destroyed$)).subscribe({
      next: data => {
        let util = new BlogUtility();
        util.analyzePosts(data);

        this.listMonth = util.listMonth;
        this.listCollection = util.listCollection;
        this.listTag = util.listTag;
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
    if (this.currentTheme === 'Theme.Default') {
      this.currentTheme = 'Theme.Dark';
      this.changeTheme('dark');
    } else if (this.currentTheme === 'Theme.Dark') {
      this.currentTheme = 'Theme.Compact';
      this.changeTheme('compact');
    } else if (this.currentTheme === 'Theme.Compact') {
      this.currentTheme = 'Theme.Default';
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

  changeTheme(theme: 'default' | 'dark' | 'compact'): void {
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

  switchLanguage(lang: string) {
    if (lang === 'en_US') {
      this.i18n.setLocale(en_US);
      this.translocoService.setActiveLang('en');
    } else {
      this.i18n.setLocale(zh_CN);
      this.translocoService.setActiveLang('zh');
    }
  }
}
