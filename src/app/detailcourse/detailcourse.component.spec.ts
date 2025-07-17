import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailcourseComponent } from './detailcourse.component';

describe('DetailcourseComponent', () => {
  let component: DetailcourseComponent;
  let fixture: ComponentFixture<DetailcourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailcourseComponent]
    });
    fixture = TestBed.createComponent(DetailcourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
