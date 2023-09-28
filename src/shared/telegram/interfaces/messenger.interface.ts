export type SendMessageOptions = {
  botId: number;
  chatId: number;
  text: string;
};

export interface Messenger {
  sendMessage(options: SendMessageOptions): Promise<unknown>;
}
