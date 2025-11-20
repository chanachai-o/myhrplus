import { Chat } from './chat';
import { ChatMessage } from './chat.component';
export interface ContactList {
  id: number;
  imagePath: string;
  name: string;
  signature: string;
  time: string;
  chats: ChatMessage[];
}
