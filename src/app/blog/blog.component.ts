import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { KatexOptions } from 'katex';

import { environment } from 'src/environments/environment';
import { JsonDataService } from '../service/json-data.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.less'],
})
export class BlogComponent implements OnInit {
  filePath: string;
  postTitle: string;
  public katexOptions: KatexOptions = {
    displayMode: true,
    throwOnError: false,
    errorColor: '#cc0000',
  };

  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: JsonDataService) { }

  ngOnInit(): void {

    let bid = -1;
    this.activateRoute.url.subscribe((x: any) => {
      if (x instanceof Array && x.length > 0) {
        bid = +x[1].path;

        const pst = this.dataService.listPost.find(val => {
          return +val.id === +x[1].path;
        });
        if (pst) {
          this.postTitle = pst.title;
        }

        this.filePath = environment.assetfolder + '/posts/' + bid.toString() + '.md';
      }
    });
  }
}
