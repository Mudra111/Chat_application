import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsTheme } from '../../store/selectors/theme.selector';
import { CommonModule } from '@angular/common';
// import { getUserChats } from '../../store/actions/chat.action';
// import { selectUser } from '../../store/selectors/auth.selector';
// import { selectChats } from '../../store/selectors/chat.selector';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { SidenavMainComponent } from '../sidenav-main/sidenav-main.component';
import {
  selectCurrentChat,
  selectMessages,
  selectNotifications,
} from 'src/store/selectors/messages.selector';
import { take } from 'rxjs';
import {
  selectOnlineUsers,
  selectUser,
} from 'src/store/selectors/auth.selector';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'src/utils/services/message.service';
import {
  fetchChatMessages,
  setNotifications,
} from 'src/store/actions/messages.action';
import { io } from 'socket.io-client';
import { setOnlineUsers } from 'src/store/actions/auth.action';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MessageTimePipe } from 'src/utils/pipes/message-time.pipe';
import { ChatServices } from 'src/utils/services/chat.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    SideNavComponent,
    SidenavMainComponent,
    FormsModule,
    PickerModule,
    MessageTimePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent
  implements DoCheck, OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  theme!: Boolean;
  user!: any;
  store: Store = inject(Store);
  chats!: any;
  endpoint: string = '/find';
  params!: string;
  messages!: any[] | null;
  currentUser!: any;
  textMessage: string = '';
  currentChat!: any;
  messageService: MessageService = inject(MessageService);
  socket!: any;
  @ViewChild('scrollContainer', { static: false })
  private scrollContainer!: ElementRef;
  showEmoji: Boolean = false;
  chatService: ChatServices = inject(ChatServices);
  isTyping: Boolean = false;
  typingTimeout!: any;
  typingSignal: Boolean = false;
  typingChat!: any;

  ngOnInit() {
    document.addEventListener('click', this.handleClickOutside.bind(this));

    this.store.select(selectIsTheme).subscribe((data) => (this.theme = data));

    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((data) => {
        this.currentUser = data;
        const newSocket = io('http://localhost:3000', {
          transports: ['websocket'],
        });

        console.log(newSocket);

        this.socket = newSocket;
        console.log(this.socket);

        if (this.socket) {
          this.socket.emit('addNewUser', this.currentUser?._id);
          this.socket.on('getOnlineUsers', (res: any) => {
            const onlineUsers = res;
            console.log(onlineUsers, '----------online users------');
            this.store.dispatch(setOnlineUsers({ onlineUsers: onlineUsers }));
          });
          this.socket.on('getMessage', (message: any) => {
            if (this.currentChat?._id === message.chatId) {
              const endpoint = 'message/getMessages';
              const chatId = this.currentChat?._id;
              console.log(chatId, '--------------------------------------');

              this.store.dispatch(
                fetchChatMessages({ endpoint: endpoint, chatId: chatId })
              );
              this.scrollToBottom();
            }
          });

          this.socket.on('getNotification', (notification: any) => {
            console.log(notification, 'response');
            const isChatOpen = this.currentChat.members.some(
              (id: any) => id === notification.senderId
            );

            if (isChatOpen) {
              console.log(notification, 'res');

              this.store.dispatch(
                setNotifications({
                  notification: { ...notification, isRead: true },
                })
              );
            } else {
              console.log(notification, 'res');

              this.store.dispatch(
                setNotifications({ notification: { ...notification } })
              );
            }
          });

          this.socket.on('typing', (data: any) => {
            this.typingSignal = data.typing;
            if (this.typingSignal) {
              this.typingChat = data.chat;
            }
          });
        }
      });

    this.store
      .select(selectCurrentChat)
      .pipe(take(1))
      .subscribe((chat) => {
        this.currentChat = chat;

        if (this.currentChat) {
          const endpoint = 'message/getMessages';
          const chatId = this.currentChat._id;
          this.store.dispatch(
            fetchChatMessages({ endpoint: endpoint, chatId: chatId })
          );
        }
      });

    if (this.currentUser) {
    }

    // this.chatService.fetchLatestMessage(this.chats);
  }

  ngAfterViewInit(): void {
    // this.scrollToBottom(); // scroll on init
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngDoCheck() {
    let users;

    this.store
      .select(selectOnlineUsers)
      .pipe(take(1))
      .subscribe((user) => (users = user));

    console.log('===========================================', users);

    this.store
      .select(selectMessages)
      .pipe(take(1))
      .subscribe((messages) => {
        this.messages = messages;
      });

    this.store
      .select(selectCurrentChat)
      .pipe(take(1))
      .subscribe((chat) => {
        this.currentChat = chat;

        // if (this.currentChat) {
        //   const endpoint = 'message/getMessages';
        //   const chatId = this.currentChat._id;
        //   this.store.dispatch(
        //     fetchChatMessages({ endpoint: endpoint, chatId: chatId })
        //   );
        // }
      });

    this.store
      .select(selectNotifications)
      .pipe(take(1))
      .subscribe((notifications) => {
        console.log(notifications, '++++++++++++++++++++++++++++++++++++');
      });
  }

  sendMessage() {
    this.messageService.sendMessage(
      this.currentChat?._id,
      this.textMessage,
      this.currentUser._id
    );
    // this.shouldScroll = true;

    this.scrollToBottom();

    const recipientUser = this.currentChat?.members?.find(
      (id: any) => id != this.currentUser._id
    );
    this.socket.emit('sendMessage', {
      textMessage: this.textMessage,
      recipientUser,
      senderId: this.currentUser._id,
      chatId: this.currentChat?._id,
    });

    // this.chatService.fetchLatestMessage(this.currentChat);

    this.textMessage = '';
  }

  scrollToBottom(): void {
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }

  toggleEmoji() {
    this.showEmoji = !this.showEmoji;
  }

  addEmoji(event: any) {
    this.textMessage += event.emoji.native;
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.emoji-picker') && !target.closest('button')) {
      this.showEmoji = false;
    }
  }

  onInput() {
    if (!this.isTyping) {
      this.isTyping = true;
      this.emitTyping(true);
    }

    clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      this.emitTyping(false);
    }, 1000);
  }

  emitTyping(isTyping: Boolean) {
    this.socket.emit('typingmsg', {
      chat: this.currentChat,
      senderId: this.currentUser._id,
      typing: isTyping,
    });
  }

  ngOnDestroy(): void {
    this.socket.off('getOnlineUsers');
    this.socket.off('getMessage');
    this.socket.off('getNotification');
  }
}
