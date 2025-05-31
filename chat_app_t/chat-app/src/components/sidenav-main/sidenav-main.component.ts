import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fetchAllUser } from '../../utils/services/fetchAllUsers.service';
import { ChatServices } from '../../utils/services/chat.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/selectors/auth.selector';
import { take } from 'rxjs';

@Component({
  selector: 'app-sidenav-main',
  imports: [MatTooltipModule, CommonModule],
  templateUrl: './sidenav-main.component.html',
  styleUrl: './sidenav-main.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavMainComponent implements OnInit {
  createChat: String = 'assets/images/icons/create-chat-icon.png';
  isCreateChat: Boolean = false;
  users: any;
  fetchAllUser: fetchAllUser = inject(fetchAllUser);
  chatService: ChatServices = inject(ChatServices);
  currentUser: any;
  store: Store = inject(Store);

  ngOnInit(): void {
    this.fetchAllUser.fetchAllUsers().then((user) => {
      this.users = user;
      console.log(user);
    });

    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  toggleUserList = () => {
    this.isCreateChat = !this.isCreateChat;
  };

  createChatWith(user: any) {
    console.log(user);

    this.chatService.createNewChat(user, this.currentUser);
  }
}
