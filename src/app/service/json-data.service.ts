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
    console.log('service.constructor');
    this.subjectPost = new BehaviorSubject([]);
    this.subjectSetting = new BehaviorSubject(undefined);
  }

  readPost(): Observable<boolean> {
    console.log('service.readpost.start');
    if (!this.isListPostLoaded) {
      return this.client.get(environment.assetfolder + '/post_def.json')
      .pipe(
        map(data => {
          console.log('service.readpost.received.map');
          if (data instanceof Array && data.length > 0) {
            let arpost: BlogPost[] = [];
            data.forEach(ditem => {
              let post = new BlogPost();
              post.id = ditem.id;
              post.title = ditem.title;
              post.createdat = moment(ditem.createdat);
              post.collection = ditem.collection;
              post.tags = ditem.tags;
              arpost.push(post);
            });

            arpost.sort((a, b) => {
              if (a.createdat.isAfter(b.createdat)) {
                return 1;
              }
              if (a.createdat.isBefore(b.createdat)) {
                return -1;
              }
              return 0;
            });
            this.subjectPost.next(arpost);
          }

          this.isListPostLoaded = true;
          return this.isListPostLoaded;
        })
      );
    } else {
      return of(this.isListPostLoaded);
    }
  }

  readSetting(): Observable<boolean> {
    if (!this.isSettingLoaded) {
      return this.client.get(environment.assetfolder + '/blog_setting.json')
      .pipe(
        map(data => {
        let setting = data as BlogSetting;
        this.subjectSetting.next(setting);

        this.isSettingLoaded = true;
        return true;
      }));
    } else {
      return of(this.isSettingLoaded);
    }
  }
}
