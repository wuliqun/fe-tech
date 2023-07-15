class ListNode<K, V> {
  key: K;
  value: V;
  prev: ListNode<K, V> | null;
  next: ListNode<K, V> | null;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.prev = this.next = null;
  }
}
class LRUCache<V, K = string | number> {
  capacity: number;
  size: number;
  private _head: ListNode<K, V> | null;
  private _tail: ListNode<K, V> | null;
  constructor(capacity: number) {
    if (capacity <= 0 || !/^\d+$/.test(String(capacity))) {
      throw new TypeError(
        `Invalid LRUCache constructor parameter, capacity: ${capacity} `
      );
    }
    this.capacity = capacity;
    this.size = 0;
    this._head = this._tail = null;
  }
  put(key: K, value: V) {
    let node = this._head;
    let contains = false;
    while (node) {
      if (node.key === key) {
        contains = true;
        node.value = value;
        if (node.prev) {
          node.prev.next = node.next;
          if (!node.next) {
            this._tail = node.prev;
          } else {
            node.next.prev = node.prev;
          }
          node.next = this._head;
          this._head!.prev = node;
          this._head = node;
          node.prev = null;
        }

        break;
      }
      node = node.next;
    }
    if (!contains) {
      node = new ListNode(key, value);
      if (!this._head) {
        this._head = this._tail = node;
        this.size++;
      } else {
        node.next = this._head;
        this._head.prev = node;
        this._head = node;
        if (this.size === this.capacity) {
          node = this._tail!.prev!;
          this._tail!.prev = null;
          node.next = null;
          this._tail = node;
        } else {
          this.size++;
        }
      }
    }
  }
  get(key: K) {
    let node = this._head;
    while (node) {
      if (node.key === key) {
        if (node.prev) {
          node.prev.next = node.next;
          if (!node.next) {
            this._tail = node.prev;
          } else {
            node.next.prev = node.prev;
          }
          node.next = this._head;
          this._head!.prev = node;
          this._head = node;
          node.prev = null;
        }
        return node.value;
      }
      node = node.next;
    }
    return null;
  }
  all() {
    const res: V[] = [];
    let node = this._head;
    while (node) {
      res.push(node.value);
      node = node.next;
    }
    return res;
  }
}

export default LRUCache;
