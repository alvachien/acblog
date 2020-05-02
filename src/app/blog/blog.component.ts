import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KatexOptions } from 'katex';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.less']
})
export class BlogComponent implements OnInit {
  filePath: string;
  public katexOptions: KatexOptions = {
    displayMode: true,
    throwOnError: false,
    errorColor: '#cc0000',
  };

  constructor(private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let bid = -1;
    this.activateRoute.url.subscribe((x: any) => {
      if (x instanceof Array && x.length > 0) {
        bid = +x[1].path;
      }

      this.filePath = environment.assetfolder + '/posts/' + bid.toString() + '.md';
    });
  }
}
