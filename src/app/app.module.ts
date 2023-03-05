import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { JsonDataService } from './service/json-data.service';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { BlogListComponent } from './blog-list/blog-list.component';
import { translocoConfig, TranslocoModule, TRANSLOCO_CONFIG } from '@ngneat/transloco';
import { translocoLoader } from './transloco-loader';
import { environment } from 'src/environments/environment';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

registerLocaleData(zh);

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  return {
    renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    HomeComponent,
    BlogListComponent
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
    NzBreadCrumbModule,
    NzMenuModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzDropDownModule,
    TranslocoModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
  ],
  providers: [
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
          switch (localId) {
              case 'en':
                  return en_US;
              /** 与 angular.json i18n/locales 配置一致 **/
              case 'zh':
                  return zh_CN;
              default:
                  return en_US;
          }
      },
      deps: [LOCALE_ID]
    },
    // {
    //   provide: NZ_I18N, useValue: zh_CN,
    // },
    JsonDataService,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
          availableLangs: ['en', 'zh'],
          defaultLang: environment.DefaultLanguage ? environment.DefaultLanguage : 'en',
          reRenderOnLangChange: true,
          prodMode: environment.production,
      })
    },
    translocoLoader,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
