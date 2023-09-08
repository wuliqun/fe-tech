type Handler = (message: string, from: string | number) => void;
type Message = {
  from: string | number;
  type: string;
  message: string;
};

class Channel {
  private channel: BroadcastChannel;
  private handlers: Map<string, Set<Handler>>;
  private messageHandler: (e: MessageEvent) => void;
  constructor(name: string) {
    this.channel = new BroadcastChannel(name);
    this.handlers = new Map();
    this.messageHandler = this.handleMessage.bind(this);
    this.channel.addEventListener("message", this.messageHandler);
  }
  private handleMessage({ data }: MessageEvent) {
    try {
      const { from, type, message }: Message = JSON.parse(data);
      const handlerSet = this.handlers.get(type);
      if (handlerSet) {
        handlerSet.forEach((handler) => {
          handler(message, from);
        });
      }
    } catch (e) {
      console.log(e);

      console.warn(`wrong message format: ${data}`);
    }
  }
  send(data: Message) {
    this.channel.postMessage(JSON.stringify(data));
  }
  on(type: string, handler: Handler) {
    let handlerSet = this.handlers.get(type);
    if (!handlerSet) {
      this.handlers.set(type, (handlerSet = new Set()));
    }
    handlerSet.add(handler);
  }
  off(type: string, handler?: Handler) {
    if (!handler) {
      this.handlers.delete(type);
    } else {
      let handlerSet = this.handlers.get(type);
      if (handlerSet) {
        handlerSet.delete(handler);
      }
    }
  }
  destroy() {
    this.channel.removeEventListener("message", this.messageHandler);
    this.channel.close();
    this.handlers.clear();
  }
}

export default Channel;
