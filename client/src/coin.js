class Coin {
  constructor({ id, x = 10, y = 10, w = 10, h = 10 }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.xpAdded = 10;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}
export default Coin;
