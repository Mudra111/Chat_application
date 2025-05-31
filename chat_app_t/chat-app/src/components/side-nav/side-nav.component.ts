import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectOnlineUsers,
  selectUser,
} from '../../store/selectors/auth.selector';
import { filter, take } from 'rxjs';
import { getUserChats } from '../../store/actions/chat.action';
import { selectChats } from '../../store/selectors/chat.selector';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';
import { CommonModule } from '@angular/common';
import {
  fetchChatMessages,
  setCurrentChat,
} from 'src/store/actions/messages.action';
import { selectMessages } from 'src/store/selectors/messages.selector';
import { ChatServices } from 'src/utils/services/chat.service';

@Component({
  selector: 'app-side-nav',
  imports: [ChatListItemComponent, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent implements OnInit, DoCheck {
  currentUser: any;
  store: Store = inject(Store);
  endpoint: any;
  isEndpointDispatched: Boolean = false;
  userChats: any;
  userEndpoint: any;
  userFetched: Boolean = false;
  recievedUsers: any;
  chatService: ChatServices = inject(ChatServices);
  @Input() typingSignal!: Boolean;
  @Input() typingChat!: any;

  ngOnInit(): void {
    this.store
      .select(selectUser)
      .pipe(
        take(1),
        filter((user) => !!user)
      )
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;

          this.endpoint = `chat/find/${this.currentUser._id}`;

          if (!this.isEndpointDispatched) {
            this.store.dispatch(getUserChats({ endpoint: this.endpoint }));
            this.isEndpointDispatched = true;
          }
          // this.chatService.fetchLatestMessage(this.userChats);
        }
      });
  }

  ngDoCheck(): void {
    this.store
      .select(selectChats)
      .pipe(take(1))
      .subscribe((chat) => {
        console.log(chat);
        this.userChats = chat;
        // this.isEndpointDispatched = false;
      });
  }

  getMessage(chat: any, currentUser: any) {
    const endpoint = 'message/getMessages';
    const chatId = chat._id;
    this.store.dispatch(
      fetchChatMessages({ endpoint: endpoint, chatId: chatId })
    );

    this.store.dispatch(setCurrentChat({ chat }));

    this.store
      .select(selectMessages)
      .pipe(take(1))
      .subscribe((messages) => {
        console.log(messages);
      });
  }
}
