import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { JsonDataService } from './service/json-data.service';
import { MarkdownModule } from 'ngx-markdown';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzListModule,
    NzPaginationModule,
    NzTableModule,
    NzDividerModule,
    NzGridModule,
    MarkdownModule.forRoot(),
  ],
  providers: [{
      provide: NZ_I18N, useValue: zh_CN,
    },
    JsonDataService
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
