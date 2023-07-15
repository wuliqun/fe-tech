const enum STATUS {
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}
class PromiseA {
  private result: any;
  private reason: any;
  status: STATUS;
  private onFulfillCallbacks;
  private onRejectCallbacks;
  constructor(executor) {
    this.result = this.reason = null;
    this.status = STATUS.PENDING;
    this.onFulfillCallbacks = [];
    this.onRejectCallbacks = [];
    executor(this._resolve, this._reject);
  }
  private static resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
      return reject(new TypeError("Chain cycle error"));
    }
    if (x && typeof x.then === "function") {
      let called = false;
      try {
        x.then(
          (y) => {
            if (called) return;
            called = true;
            PromiseA.resolvePromise(promise, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } catch (err) {
        reject(err);
      }
    } else {
      resolve(x);
    }
  }
  private _resolve = (result) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.FULFILLED;
      this.result = result;
      this.onFulfillCallbacks.forEach((cb) => cb());
    }
  };
  private _reject = (reason) => {
    if (this.status === STATUS.PENDING) {
      this.status = STATUS.REJECTED;
      this.reason = reason;
      this.onRejectCallbacks.forEach((cb) => cb());
    }
  };
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (result) => result;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };
    const promise = new PromiseA((resolve, reject) => {
      try {
        switch (this.status) {
          case STATUS.FULFILLED:
            setTimeout(() => {
              try {
                PromiseA.resolvePromise(
                  promise,
                  onFulfilled(this.result),
                  resolve,
                  reject
                );
              } catch (e) {
                reject(e);
              }
            });
            break;
          case STATUS.REJECTED:
            try {
              PromiseA.resolvePromise(
                promise,
                onRejected(this.reason),
                resolve,
                reject
              );
            } catch (e) {
              reject(e);
            }
            break;
          case STATUS.PENDING:
            this.onFulfillCallbacks.push(() => {
              setTimeout(() => {
                PromiseA.resolvePromise(
                  promise,
                  onFulfilled(this.result),
                  resolve,
                  reject
                );
              });
            });
            this.onRejectCallbacks.push(() => {
              setTimeout(() => {
                PromiseA.resolvePromise(
                  promise,
                  onRejected(this.reason),
                  resolve,
                  reject
                );
              });
            });
            break;
        }
      } catch (err) {
        reject(err);
      }
    });

    return promise;
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

export default PromiseA;
