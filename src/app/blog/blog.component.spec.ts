import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { BlogComponent } from './blog.component';
import { getTranslocoModule } from '../../testing';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MarkdownModule } from 'ngx-markdown';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NzBreadCrumbModule,
        NzButtonModule,
        MarkdownModule.forRoot(),
        getTranslocoModule(),
      ],
      declarations: [ BlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
