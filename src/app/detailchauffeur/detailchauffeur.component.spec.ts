import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailchauffeurComponent } from './detailchauffeur.component';

describe('DetailchauffeurComponent', () => {
  let component: DetailchauffeurComponent;
  let fixture: ComponentFixture<DetailchauffeurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailchauffeurComponent]
    });
    fixture = TestBed.createComponent(DetailchauffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
