import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {CityData} from './cityData.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import fetchMock from 'fetch-mock';

describe('CityData', () => {
  let component: CityData;
  let fixture: ComponentFixture<CityData>;
  let compiled;
  let appInput;
  let submitButton;
  let cityData;
  let noResult;

  const pushValue = async (value) => {
    appInput.value = value;
    appInput.dispatchEvent(new Event('change'));
    appInput.dispatchEvent(new Event('input'));
    submitButton.click();
    await fixture.whenStable();
  };

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };

  afterEach(fetchMock.reset);

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule,
          FormsModule
        ],
        declarations: [CityData]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityData);
    fixture.autoDetectChanges(true);
    compiled = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    appInput = getByTestId('app-input');
    submitButton = getByTestId('submit-button');
    cityData = getByTestId('city-data');
    noResult = getByTestId('no-result');
    fixture.detectChanges();
  });

  it(`Initial UI is rendered as expected`, async () => {
    await fixture.whenStable();
    expect(appInput.textContent.trim()).toBe('');
    expect(submitButton.textContent.trim()).toBe('Search');
    expect(cityData).toBeNull();
    expect(noResult).toBeNull();
  });

  it('search is made on by clicking on search button and no results found', async(done) => {
    const url = 'https://jsonmock.hackerrank.com/api/cities?city=Abcdefgh';
    fetchMock.getOnce(url, JSON.stringify({ page:1,per_page:10,total:0,total_pages:0,data:[]}));
    await pushValue('Abcdefgh');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const wasFetchCalled = fetchMock.done();
      expect(wasFetchCalled).toBe(true);
      fetchMock.called(url);
      expect(getByTestId('city-data')).toBeNull();
      expect(getByTestId('no-result')).toBeTruthy();
      expect(getByTestId('no-result').innerHTML).toEqual('No Results Found');
      done();
    }, 500);
  });

  it('search is made on by clicking on search button and result found - test 1', async(done) => {
    const url = 'https://jsonmock.hackerrank.com/api/cities?city=Dallas';
    fetchMock.getOnce(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
        "city": "Dallas",
        "state": "Texas"
      },
      {
        "city": "Dallas",
        "state": "Oregon"
      }]
    }));
    await pushValue('Dallas');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const wasFetchCalled = fetchMock.done();
      expect(wasFetchCalled).toBe(true);
      fetchMock.called(url);
      const results = getByTestId('city-data');
      expect(results).toBeTruthy();
      expect(results.children.length).toEqual(2);
      expect(results.children[0].innerHTML).toEqual('Texas');
      expect(results.children[1].innerHTML).toEqual('Oregon');
      expect(getByTestId('no-result')).toBeNull();
      done();
    }, 500);
  });

  it('search is made on by clicking on search button and result found - test 2', async(done) => {
    const url = 'https://jsonmock.hackerrank.com/api/cities?city=Jackson';
    fetchMock.getOnce(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [
        {
          "city": "Jackson",
          "state": "Tennessee"
        },
        {
          "city": "Jackson",
          "state": "Ohio"
        },
        {
          "city": "Jackson",
          "state": "Wyoming"
        },
        {
          "city": "Jackson",
          "state": "Michigan"
        },
        {
          "city": "Jackson",
          "state": "Mississippi"
        },
        {
          "city": "Jackson",
          "state": "Missouri"
        },
        {
          "city": "Jacksonville",
          "state": "Alabama"
        },
        {
          "city": "Jacksonville",
          "state": "Arkansas"
        },
        {
          "city": "Jacksonville",
          "state": "Florida"
        },
        {
          "city": "Jacksonville",
          "state": "Illinois"
        }
      ]
    }));
    await pushValue('Jackson');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const wasFetchCalled = fetchMock.done();
      expect(wasFetchCalled).toBe(true);
      fetchMock.called(url);
      const results = getByTestId('city-data');
      expect(results).toBeTruthy();
      expect(results.children.length).toEqual(10);
      expect(results.children[0].innerHTML).toEqual('Tennessee');
      expect(results.children[1].innerHTML).toEqual('Ohio');
      expect(results.children[2].innerHTML).toEqual('Wyoming');
      expect(results.children[3].innerHTML).toEqual('Michigan');
      expect(results.children[4].innerHTML).toEqual('Mississippi');
      expect(results.children[5].innerHTML).toEqual('Missouri');
      expect(results.children[6].innerHTML).toEqual('Alabama');
      expect(results.children[7].innerHTML).toEqual('Arkansas');
      expect(results.children[8].innerHTML).toEqual('Florida');
      expect(results.children[9].innerHTML).toEqual('Illinois');
      expect(getByTestId('no-result')).toBeNull();
      done();
    }, 500);
  });
});
