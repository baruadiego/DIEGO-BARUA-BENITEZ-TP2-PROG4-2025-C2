import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMenu } from './post-menu';

describe('PostMenu', () => {
  let component: PostMenu;
  let fixture: ComponentFixture<PostMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
