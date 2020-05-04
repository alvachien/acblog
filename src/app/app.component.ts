import { Component, OnInit, OnDestroy } from '@angular/core';
import { JsonDataService } from './service/json-data.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = '';
  footer = '';
  listCollection: string[] = [];
  listDate: string[] = [];

  constructor(private dataService: JsonDataService) {
  }

  ngOnInit() {
    forkJoin([
      this.dataService.readPost(),
      this.dataService.readSetting()
    ]).subscribe({
      next: rtns => {
        // let posts = rtns[0];
        const setting = rtns[1];
        this.title = setting.title;
        this.footer = setting.footer;
        document.title = this.title;
    
        this.dataService.listPost.forEach(val => {
          if (val.createdat) {
            const cdt = new Date(val.createdat);
            const cdtstr = cdt.toDateString();
            if (this.listDate.indexOf(cdtstr) === -1) {
              this.listDate.push(cdtstr);
            }
          }
          val.collection.forEach(col => {
            if (this.listCollection.indexOf(col) === -1) {
              this.listCollection.push(col);
            }
          });
        });
      }
    });
  }
  ngOnDestroy() {
  }
}
