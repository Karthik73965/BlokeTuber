export interface ChatMessage {
  id: string;
  sender: 'user' | 'chatgpt';
  text: string;
  startFrame: number;
  typingDurationFrames: number;
  sendFrame: number;
  isShock?: boolean;
  isBlast?: boolean;
}

export interface ChatGPTVideoProps extends Record<string, unknown> {
  messages: ChatMessage[];
  title?: string;
  enableBgm?: boolean;
}
