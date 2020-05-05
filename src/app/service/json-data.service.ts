import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BlogSetting, BlogPost } from '../model/blogmodel';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {
  private _listPost: BlogPost[] = []; 
  private _setting: BlogSetting;
  isListPostLoaded = false;
  isSettingLoaded = false;

  get listPost(): any[] {
    return this._listPost;
  }
  get setting(): any {
    return this._setting;
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
