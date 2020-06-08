hlp.Renderer2D = class Renderer2D {
  constructor(canvas) {
    this.canvas = canvas;

    if (this.canvas.getContext) this.ctx = this.canvas.getContext("2d");
    else return alert("Browser does not support the canvas!");
    if (this.ctx == null) return alert("Browser does not support the canvas!");

    this._doFill = true;
    this._doStroke = true;
    this._firstPosShapes = null;
    this._font = "Arial";
    this._fontSize = 10;
    this._prevStates = [];

    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  fill(...args) {
    this._doFill = true;
    if (typeof args[0] == "string") {
      // if fill type is with string (hexidecimal, rgb(), ect.)
      this.ctx.fillStyle == args[0];
    } else if (typeof args[0] == "number") {
      // if args is with number
      if (args.length == 1) {
        // if only one argument
        this.ctx.fillStyle = `rgb(${args[0]}, ${args[0]}, ${args[0]})`;
      } else if (args.length == 3) {
        // for all colours
        this.ctx.fillStyle = `rgb(${args[0]}, ${args[1]}, ${args[2]})`;
      } else if (args.length >= 4) {
        // with alpha
        this.ctx.fillStyle = `rgb(${args[0]}, ${args[1]}, ${args[2]}, ${args[3]})`;
      } else throw new Error("Invalid param for fill!");
    } else throw new Error("Invalid param for fill!");
  }

  stroke(...args) {
    this._doStroke = true;
    if (typeof args[0] == "string") {
      // if fill type is with string (hexidecimal, rgb(), ect.)
      this.ctx.strokeStyle == args[0];
    } else if (typeof args[0] == "number") {
      // if args is with number
      if (args.length == 1) {
        // if only one argument
        this.ctx.strokeStyle = `rgb(${args[0]}, ${args[0]}, ${args[0]})`;
      } else if (args.length == 3) {
        // for all colours
        this.ctx.strokeStyle = `rgb(${args[0]}, ${args[1]}, ${args[2]})`;
      } else if (args.length >= 4) {
        // with alpha
        this.ctx.strokeStyle = `rgb(${args[0]}, ${args[1]}, ${args[2]}, ${args[3]})`;
      } else throw new Error("Invalid param for stroke!");
    } else throw new Error("Invalid param for stroke!");
  }

  noFill() {
    this._doFill = false;
  }

  noStroke() {
    this._doStroke = false;
  }

  strokeWeight(s) {
    this.ctx.lineWidth = s;
  }

  beginShape() {
    if (this._firstPosShapes != null) throw new Error("Cannot beginShape before closing/ending!");
    this.ctx.beginPath();
  }

  endShape(close = true) {
    if (this._firstPosShapes == null) throw new Error("Cannot endShape before begining one!");
    if (close) this.ctx.closePath(this._firstPosShapes.x, this._firstPosShapes.y);
    if (this._doFill) this.ctx.fill();
    if (this._doStroke) this.ctx.stroke();
    this._firstPosShapes = null;
  }

  vertex(x, y) {
    if (this._firstPosShapes == null) {
      this._firstPosShapes = new hlp.Vector(x, y);
      this.ctx.moveTo(x, y);
    } else this.ctx.lineTo(x, y);
  }

  rect(x, y, width, height) {
    if (this._doFill) this.ctx.fillRect(x, y, width, height);
    if (this._doStroke) this.ctx.strokeRect(x, y, width, height);
  }

  image(img, x, y, width = img.width, height = img.height) {
    this.ctx.drawImage(img, x, y, width, height);
  }

  triangle(...args) {
    this.beginShape();
    if (args[0] instanceof hlp.Vector) {
      this.vertex(args[0].x, args[0].y);
      this.vertex(args[1].x, args[1].y);
      this.vertex(args[2].x, args[2].y);
    } else if (typeof args[0] == "number") {
      this.vertex(args[0], args[1]);
      this.vertex(args[2], args[3]);
      this.vertex(args[4], args[5]);
    } else throw new Error("Invalid data for shape");

    this.endShape();
  }

  triangleInflate(v1, v2, v3) {
    // calculate middle
    const center = new hlp.Vector(v1.x + v2.x + v3.x, v1.y + v2.y + v3.y).div(3);
    v1 = hlp.Vector.sub(v1, center);
    v2 = hlp.Vector.sub(v2, center);
    v3 = hlp.Vector.sub(v3, center);

    // inflate tri by 1 px
    this.triangle(v1.setMag(v1.mag() + 1).add(center), v2.setMag(v2.mag() + 1).add(center), v3.setMag(v3.mag() + 1).add(center));
  }

  point(x, y) {
    this.rect(x, y, 1, 1);
  }

  line(...args) {
    this.beginShape();
    if (args[0] instanceof hlp.Vector) {
      this.vertex(args[0].x, args[0].y);
      this.vertex(args[1].x, args[1].y);
    } else if (typeof args[0] == "number") {
      this.vertex(args[0], args[1]);
      this.vertex(args[2], args[3]);
    } else throw new Error("Invalid data for line.");
    this.endShape(false);
  }

  // make a rectangle that fills the screen (clears it)
  background(...args) {
    this.push();
    this.fill(...args);
    this.noStroke();
    this.rect(0, 0, this.width, this.height);
    this.pop();
  }

  translate(x, y = 0) {
    this.ctx.translate(x, y);
  }

  rotate(x) {
    this.ctx.rotate(x * hlp.toRadians());
  }

  scale(x, y = 0) {
    this.ctx.scale(x, y);
  }

  // push and pop to restore and save states
  push() {
    this._prevStates.push({
      _doFill: this._doFill,
      _doStroke: this._doStroke,
      _font: this._font,
      _fontSize: this._fontSize,
    });

    this.ctx.save();
  }

  pop() {
    Object.assign(this, this._prevStates.pop());
    this.ctx.restore();
  }

  // TEXT STUFF DOWN HERE
  text(str, x, y) {
    this.ctx.font = `${this._fontSize}px ${this._font}`;
    this.ctx.fillText(str, x, y);
  }

  textFont(font) {
    this._font = font;
  }

  textSize(size) {
    this._fontSize = size;
  }

  textAlign(mode) {
    this.ctx.textAlign = mode;
  }

  _rendererResize(w, h) {
    this.width = w;
    this.hirght = h;
  }
};