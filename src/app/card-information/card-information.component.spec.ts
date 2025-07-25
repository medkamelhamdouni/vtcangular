import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInformationComponent } from './card-information.component';

describe('CardInformationComponent', () => {
  let component: CardInformationComponent;
  let fixture: ComponentFixture<CardInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardInformationComponent]
    });
    fixture = TestBed.createComponent(CardInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
