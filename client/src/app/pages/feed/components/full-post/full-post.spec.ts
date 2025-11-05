import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPost } from './full-post';

describe('FullPost', () => {
  let component: FullPost;
  let fixture: ComponentFixture<FullPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullPost]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullPost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
