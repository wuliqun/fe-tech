function Parent(v) {
  this.v = v;
}

Parent.prototype.test = function () {
  console.log(this.v);
};

function Child() {
  Parent.call(this, 123);
}

const c = new Child();
console.log(c.v);
console.log(typeof c.test);
