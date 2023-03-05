import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { KatexOptions } from 'katex';

import { environment } from 'src/environments/environment';
import { JsonDataService } from '../service/json-data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.less'],
})
export class BlogComponent implements OnInit, OnDestroy {
  private _destroyed$: ReplaySubject<boolean> | null = null;

  filePath = '';
  postTitle = '';
  postId: number;
  prevPostId: number;
  nextPostId: number;
  public katexOptions: KatexOptions = {
    // displayMode: true,
    throwOnError: false,
    errorColor: '#cc0000',
  };
  queryParams: any = {};
 
  get previousButtonEnabled(): boolean {
    return this.prevPostId !== -1;
  }
  get nextButtonEnabled(): boolean {
    return this.nextPostId !== -1;
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: JsonDataService,
    private router: Router) {
    this.postId = -1;
    this.prevPostId = -1;
    this.nextPostId = -1;
  }

  ngOnInit(): void {
    this._destroyed$ = new ReplaySubject(1);
    this.activateRoute.queryParams.subscribe({
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

    this.dataService.subjectPost.pipe(takeUntil(this._destroyed$)).subscribe({
      next: val => {
        if (this.postId !== -1) {
          const pstidx = val.findIndex(val2 => {
            return +val2.id === this.postId;
          });
          if (pstidx !== -1) {
            this.postTitle = val[pstidx].title;

            if (pstidx > 0) {
              this.prevPostId = val[pstidx - 1].id;
            } else {
              this.prevPostId = -1;
            }
            if (pstidx !== val.length - 1) {
              this.nextPostId = val[pstidx + 1].id;
            } else {
              this.nextPostId = -1;
            }
          } else {
            this.prevPostId = -1;
            this.nextPostId = -1;
          }

          this.filePath = `${environment.assetfolder}/${this.dataService.currentBlog}/posts/${this.postId.toString()}.md`;
        }
      }
    });

    this.activateRoute.url.subscribe((x: any) => {
      console.debug("ACBlog Debug: " + x);

      if (x instanceof Array && x.length > 0) {
        this.postId = +x[1].path;

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

  onGoPrevious(): void {
    if (this.previousButtonEnabled) {
      this.router.navigate(['blog', this.prevPostId], { queryParams: this.queryParams });
    }
  }
  onGoNext(): void {
    if (this.nextButtonEnabled) {
      this.router.navigate(['blog', this.nextPostId], { queryParams: this.queryParams });
    }
  }
}
