import {Component, OnInit} from '@angular/core';

const API_BASEURL = 'https://jsonmock.hackerrank.com/api/cities?city='
interface ApiCitiesLookupResponse {
  data: {city: string; state: string;}[]
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  city: string;
}

@Component({
  selector: 'city-data',
  templateUrl: './cityData.component.html',
  styleUrls: ['./cityData.component.scss']
})
export class CityData implements OnInit {

  search_term: string = '';
  states: string[] = [];

  ngOnInit() {

  }

  async searchCity() {
    const apiUrl = `${API_BASEURL}${this.search_term}`;
    const resp = await fetch(apiUrl);
    const json: ApiCitiesLookupResponse = await resp.json();

    this.states = json.data.map(item => item.state);
  }
}

//1. loading
//2. error message
//3. debouncing
//4. press enter -> search
