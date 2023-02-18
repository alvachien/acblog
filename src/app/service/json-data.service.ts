import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';
import { BlogSetting, BlogPost, } from '../model/blogmodel';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  // private _listPost: BlogPost[] = [];
  // private _setting: BlogSetting;
  isListPostLoaded = false;
  isListPostLoading = false;
  isSettingLoaded = false;

  subjectPost: BehaviorSubject<BlogPost[]>;
  subjectSetting: BehaviorSubject<BlogSetting>;

  get listPost(): BlogPost[] {
    return this.subjectPost.getValue();
  }
  get setting(): BlogSetting {
    return this.subjectSetting.getValue();
  }

  constructor(private client: HttpClient) {
    let arposts: BlogPost[] = [];
    this.subjectPost = new BehaviorSubject(arposts);
    let setting: BlogSetting = new BlogSetting();
    this.subjectSetting = new BehaviorSubject(setting);
  }

  readPost(): Observable<boolean> {
    if (!this.isListPostLoaded && !this.isListPostLoading) {
      this.isListPostLoading = true;
      return this.client.get(environment.assetfolder + '/post_def.json')
      .pipe(
        map(data => {
          if (data instanceof Array && data.length > 0) {
            const arpost: BlogPost[] = [];
            data.forEach(ditem => {
              const post = new BlogPost();
              post.id = ditem.id;
              post.title = ditem.title;
              post.brief = ditem.brief;
              post.createdat = moment(ditem.createdat);
              post.collection = ditem.collection;
              post.tags = ditem.tags;
              arpost.push(post);
            });

            arpost.sort((a, b) => {
              if (a.createdat.isAfter(b.createdat)) {
                return -1;
              }
              if (a.createdat.isBefore(b.createdat)) {
                return 1;
              }
              return 0;
            });
            this.subjectPost.next(arpost);
          }

          this.isListPostLoaded = true;
          this.isListPostLoading = false;
          return this.isListPostLoaded;
        })
      );
    } else {
      if (this.isListPostLoading) {
        return of(false);
      }
      if (this.isListPostLoaded) {
        // Re-boardcast
        const arposts = this.subjectPost.value;
        this.subjectPost.next(arposts);
      }

      return of(false);
    }
  }

  readSetting(): Observable<boolean> {
    if (!this.isSettingLoaded) {
      return this.client.get(environment.assetfolder + '/blog_setting.json')
      .pipe(
        map(data => {
        const setting = data as BlogSetting;
        this.subjectSetting.next(setting);

        this.isSettingLoaded = true;
        return true;
      }));
    } else {
      if (this.isListPostLoaded) {
        // Re-boardcast
        const setting = this.subjectSetting.value;
        this.subjectSetting.next(setting);
      }
      return of(this.isSettingLoaded);
    }
  }
}
