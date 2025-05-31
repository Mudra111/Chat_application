import {
  AfterViewInit,
  Component,
  DoCheck,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { fetchRecipientUser } from '../../utils/services/fetchRecipientUser.service';
import { selectOnlineUsers } from 'src/store/selectors/auth.selector';
import { fetchChatMessages } from 'src/store/actions/messages.action';
import { selectMessages } from 'src/store/selectors/messages.selector';
import { ChatServices } from 'src/utils/services/chat.service';

@Component({
  selector: 'app-chat-list-item',
  imports: [CommonModule],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
})
export class ChatListItemComponent implements OnInit, DoCheck {
  @Input() chat!: any;
  @Input() currentUser!: any;
  @Input() typingSignal!: Boolean;
  @Input() typingChat!: any;
  recipientUser!: any;
  fetchRecipientUser: fetchRecipientUser = inject(fetchRecipientUser);
  store: Store = inject(Store);
  onlineUsers!: any;
  isOnline: Boolean = false;
  currentChat!: any;
  latestMessage!: any;
  chatService: ChatServices = inject(ChatServices);

  ngOnInit(): void {
    this.fetchRecipientUser
      .fetchRecipientUser(this.currentUser, this.chat)
      .then((user) => {
        this.recipientUser = user;
        console.log(this.recipientUser, this.chat._id);
      })
      .catch((error) => {
        console.error('Error fetching recipient user:', error);
      });

    // this.chatService.fetchLatestMessage(this.chat).then((message) => {
    //   this.latestMessage = message;
    //   console.log(message);
    //   console.log(
    //     this.latestMessage,
    //     '============================+++++++++++++++++++++++'
    //   );
    // });

    // this.recipientUser = this.fetchRecipientUser.fetchRecipientUser(
    //   this.currentUser,
    //   this.chat
    // );

    // console.log(this.recipientUser, this.chat._id);
  }

  ngDoCheck(): void {
    // this.latestMessage = this.chatService.latestMessages.find(
    //   (msg: any) => msg.chatId === this.chat._id
    // );

    this.store
      .select(selectOnlineUsers)
      .pipe(take(1))
      .subscribe((users) => {
        this.onlineUsers = users;
        if (
          this.onlineUsers.some(
            (user: any) => user.userId === this.recipientUser?._id
          )
        ) {
          this.isOnline = true;
        }
      });
  }
}
