import { Component, OnInit } from '@angular/core';
import { JsonDataService } from '../service/json-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(public dataService: JsonDataService) {
  }

  ngOnInit(): void {
  }
}
