import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuggetEditorComponent } from './nugget-editor.component';

describe('NuggetEditorComponent', () => {
  let component: NuggetEditorComponent;
  let fixture: ComponentFixture<NuggetEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuggetEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuggetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
