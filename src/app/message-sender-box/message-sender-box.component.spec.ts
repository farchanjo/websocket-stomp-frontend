import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSenderBoxComponent } from './message-sender-box.component';

describe('MessageSenderBoxComponent', () => {
  let component: MessageSenderBoxComponent;
  let fixture: ComponentFixture<MessageSenderBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageSenderBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSenderBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
