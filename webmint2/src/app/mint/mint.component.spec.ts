/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MintComponent } from './mint.component';

describe('MintComponent', () => {
  let component: MintComponent;
  let fixture: ComponentFixture<MintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
