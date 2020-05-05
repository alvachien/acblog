import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';
import { BlogSetting, BlogPost, BlogCollectionSet, BlogDateSet } from '../model/blogmodel';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  private _listPost: BlogPost[] = []; 
  private _setting: BlogSetting;
  private _listCollection: BlogCollectionSet[] = [];
  private _listDates: BlogDateSet[] = [];
  isListPostLoaded = false;
  isSettingLoaded = false;

  get listPost(): any[] {
    return this._listPost;
  }
  get setting(): any {
    return this._setting;
  }
  get CollectionSet(): BlogCollectionSet[] {
    return this._listCollection;
  }
  get DateSet(): BlogDateSet[] {
    return this._listDates;
  }

  constructor(private client: HttpClient) {
  }

  readPost(): Observable<BlogPost[]> {
    if (!this.isListPostLoaded) {
      return this.client.get(environment.assetfolder + '/post_def.json')
      .pipe(
        map(data => {
        this._listPost = data as BlogPost[];
        this._listPost.sort((a, b) => {
          return -1 * a.createdat.localeCompare(b.createdat);
        });
        this.isListPostLoaded = true;

        // Workout
        this._listPost.forEach(val => {
          if (val.createdat) {
            const cdt = new Date(val.createdat);
            // const cdtstr = cdt.toDateString();

            const postidx = this._listDates.findIndex(val2 => {
              return val.createdat === val2.postdate;
            });
            if (postidx === -1) {
              let objdate = new BlogDateSet();
              objdate.postdate = val.createdat;
              objdate.posts = [];
              objdate.posts.push(val);
              this._listDates.push(objdate);
            } else {
              this._listDates[postidx].posts.push(val);
            }
          }

          val.collection.forEach(col => {
            if (this.listCollection.indexOf(col) === -1) {
              this.listCollection.push(col);
            }
          });
        });

        return this.listPost;
      }));
    } else {
      return of(this.listPost);
    }
  }

  readSetting(): Observable<BlogSetting> {
    if (!this.isSettingLoaded) {
      return this.client.get(environment.assetfolder + '/blog_setting.json')
      .pipe(
        map(data => {
        this._setting = data as BlogSetting;
        this.isSettingLoaded = true;
        return this.setting;
      }));
    } else {
      return of(this.setting);
    }
  }
}
