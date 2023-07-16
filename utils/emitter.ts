class Emitter {
  private _callbacks: Map<string, Set<(...args: any) => void>>;
  constructor() {
    this._callbacks = new Map();
  }

  on(event: string, cb: (...args: any) => void) {
    let cbs = this._callbacks.get(event);
    if (!cbs) {
      this._callbacks.set(event, (cbs = new Set<(...args: any) => void>()));
    }
    cbs.add(cb);
  }
  off(event: string, cb?: (...args: any) => void) {
    if (!cb) {
      this._callbacks.delete(event);
    } else {
      let cbs = this._callbacks.get(event);
      if (cbs) {
        cbs.delete(cb);
      }
    }
  }
  emit(event: string, ...args) {
    let cbs = this._callbacks.get(event);
    if (cbs) {
      cbs.forEach((cb) => cb(...args));
    }
  }
}

export default Emitter;
