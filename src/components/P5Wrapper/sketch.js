import imageD from "../images/d.png";
import imageE from "../images/e.png";
import imageM from "../images/m.png";
import imageO from "../images/o.png";
import imageK from "../images/k.png";
import imageA from "../images/a.png";
import imageP from "../images/p.png";

export default function(p) {
  let gyro = false;
  window.addEventListener("devicemotion", function(event) {
    if (
      event.rotationRate.alpha ||
      event.rotationRate.beta ||
      event.rotationRate.gamma
    )
      gyro = true;
  });

  var canvasContainer = document.getElementById("canvas-container");
  const config = {
    gyro,
    p,
    margin: 75,
    watch: 100,
    spacing: 15,
    firstRun: true,
    levels: 4,
    perc_min: [10, 25, 45, 70],
    perc_max: [30, 55, 75, 90],

    accx: 0,
    accy: 0,
    objectSizes: 0,
    globalX: 0,
    globalY: 0,
    default_perc: 0,
    easing: 0.15
  };

  const {
    levels,
    accx,
    accy,

    easing,
    perc_min,
    perc_max
  } = config;

  let {
    margin,
    watch,
    objectSizes,
    firstRun,
    default_perc,
    spacing,
    globalX,
    globalY
  } = config;

  let source_k = 0;
  let source_a = 0;
  let source_p = 0;

  let letter_k = 0;
  let letter_a = 0;
  let letter_p = 0;
  let letter_p2 = 0;
  let letter_a2 = 0;

  // let levels = 9;
  // let perc_min = [5, 10, 17, 25, 34, 45, 57, 70, 84];
  // let perc_max = [16, 30, 43, 55, 66, 75, 83, 90, 96];

  // Methods -------------------------------------------------------------------
  p.setOnReady = function(cb) {
    onReady = cb;
  };

  p.pushProps = function(_props) {
    props = _props;
    p.loop();
  };

  // Private members -----------------------------------------------------------
  let onReady = () => {};
  let props = {};

  // Lifecycle methods =========================================================
  // preload() -----------------------------------------------------------------
  p.preload = function() {
    source_k = p.loadImage(imageK);
    source_a = p.loadImage(imageA);
    source_p = p.loadImage(imageP);
  };

  // setup() -------------------------------------------------------------------
  p.setup = function() {
    console.log("SETUP");
    objectSizes = getObjectSizes(canvasContainer);
    // canvasObserver(canvasContainer);
    p.createCanvas(objectSizes.width, objectSizes.height);
    p.rectMode(p.CORNER);
    p.noStroke();
    default_perc = 100 / (levels + 1);
    globalX = objectSizes.width / 2;
    globalY = objectSizes.height / 2;
    p.frameRate(60);

    if (objectSizes.width < 440) {
      spacing = 5;
    }

    letter_k = new Mesh(
      0,
      0,
      objectSizes.width / 2 - spacing,
      objectSizes.height / 2 - spacing,
      source_k
    );

    letter_a = new Mesh(
      objectSizes.width / 2,
      0,
      objectSizes.width / 2 - spacing,
      objectSizes.height / 2 - spacing,
      source_a
    );

    letter_p = new Mesh(
      0,
      objectSizes.height / 2,
      objectSizes.width / 3 - spacing,
      objectSizes.height / 2 - spacing,
      source_p
    );
    letter_p2 = new Mesh(
      objectSizes.width / 3,
      objectSizes.height / 2,
      objectSizes.width / 3 - spacing,
      objectSizes.height / 2,
      source_p
    );
    letter_a2 = new Mesh(
      objectSizes.width - objectSizes.width / 3,
      objectSizes.height / 2,
      objectSizes.width / 3 - spacing,
      objectSizes.height / 2,
      source_a
    );
  };

  p.windowResized = () => {
    objectSizes.width = p.windowWidth > 400 ? p.windowWidth : 400;
    objectSizes.height = p.windowHeight > 400 ? p.windowHeight : 400;
    p.resizeCanvas(objectSizes.width, objectSizes.height);

    margin = objectSizes.width / 20;
    watch = objectSizes.width / 15;
    if (objectSizes.width < 440) {
      spacing = 5;
    } else {
      spacing = 15;
    }

    if (letter_k && letter_a && letter_p && letter_p2 && letter_a2) {
      letter_k.updatePositions(
        0,
        0,
        objectSizes.width / 2 - spacing,
        objectSizes.height / 2 - spacing,
      );
      letter_a.updatePositions(
        objectSizes.width / 2,
        0,
        objectSizes.width / 2 - spacing,
        objectSizes.height / 2 - spacing,
      );
      letter_p.updatePositions(
        0,
        objectSizes.height / 2,
        objectSizes.width / 3 - spacing,
        objectSizes.height / 2 - spacing,
      );
      letter_p2.updatePositions(
        objectSizes.width / 3,
        objectSizes.height / 2,
        objectSizes.width / 3 - spacing,
        objectSizes.height / 2,
      );
      letter_a2.updatePositions(
        objectSizes.width - objectSizes.width / 3,
        objectSizes.height / 2,
        objectSizes.width / 3 - spacing,
        objectSizes.height / 2,
      );
    }
  };

  // draw() --------------------------------------------------------------------
  p.draw = function() {
    p.clear();
    if (gyro) {
      if (accx !== undefined) {
        globalX = globalX + accx * 2;
      }

      if (accy !== undefined) {
        globalY = globalY - accy * 2;
      }
    } else {
      var targetX = p.mouseX;
      var dx = targetX - globalX;
      globalX += dx * easing;

      var targetY = p.mouseY;
      var dy = targetY - globalY;
      globalY += dy * easing;
    }

    // Setting global mouse possitio
    // If is outside the bounderies it will set the lowest/highest value of the canvas
    if (globalY < margin) globalY = margin;
    if (globalX < margin) globalX = margin;
    if (globalY > objectSizes.height - margin)
      globalY = objectSizes.height - margin;
    if (globalX > objectSizes.width - margin)
      globalX = objectSizes.width - margin;

    // Display the letters sending the global coorinates of the mouse
    letter_k.display(globalX, globalY);
    letter_a.display(globalX, globalY);
    letter_p.display(globalX, globalY);
    letter_p2.display(globalX, globalY);
    letter_a2.display(globalX, globalY);

    if (firstRun) {
      firstRun = false;
    }
  };

  var Mesh = (function() {
    function Mesh(_x, _y, _w, _h, _source) {
      this.x = _x;
      this.y = _y;
      this.w = _w;
      this.h = _h;
      this.source = _source;

      this.tiles = [];

      this.lines_left = [];
      this.lines_right = [];
      this.lines_up = [];
      this.lines_down = [];
      this.lines_x = [];
      this.lines_y = [];

      this.ssx = this.source.width / (levels * 2 + 2);
      this.ssy = this.source.height / (levels * 2 + 2);

      for (var i = 0; i < levels; i++) {
        this.lines_left[i] = 0;
        this.lines_right[i] = 0;
        this.lines_up[i] = 0;
        this.lines_down[i] = 0;
      }

      for (var _i = 0; _i < levels * 2 + 2; _i++) {
        this.lines_x[_i] = 0;
        this.lines_y[_i] = 0;
      }

      for (var _i2 = 0; _i2 < levels * 2 + 2; _i2++) {
        this.tiles[_i2] = [];
        for (var j = 0; j < levels * 2 + 2; j++) {
          var tilex = Math.ceil(j * this.ssx);
          var tiley = Math.ceil(_i2 * this.ssy);
          this.tiles[_i2][j] = this.source.get(
            tilex,
            tiley,
            this.ssx,
            this.ssy
          );
        }
      }
      this.updatePositions = (_x, _y, _w, _h) => {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
      };

      this.display = (tx, ty) => {
        if (tx < this.x - watch) {
          this.xvalue = -1;
          this.curX = margin;
        } else if (tx > this.x + this.w + watch) {
          this.xvalue = 1;
          this.curX = this.w - margin;
        } else {
          this.xvalue = p.map(
            tx,
            this.x - watch,
            this.x + this.w + watch,
            -1,
            1
          );
          this.curX = p.map(
            tx,
            this.x - watch,
            this.x + this.w + watch,
            margin,
            this.w - margin
          );
        }

        if (this.xvalue <= 0) {
          for (var i = 0; i < this.lines_left.length; i++) {
            var perc = p.map(
              this.xvalue,
              -1,
              0,
              perc_min[i],
              default_perc * (i + 1)
            );
            this.lines_left[i] = (this.curX / 100) * perc;
            this.lines_right[i] =
              this.curX + ((this.w - this.curX) / 100) * perc;
          }
        } else {
          for (var _i3 = 0; _i3 < this.lines_left.length; _i3++) {
            var _perc = p.map(
              this.xvalue,
              0,
              1,
              default_perc * (_i3 + 1),
              perc_max[_i3]
            );
            this.lines_left[_i3] = (this.curX / 100) * _perc;
            this.lines_right[_i3] =
              this.curX + ((this.w - this.curX) / 100) * _perc;
          }
        }

        if (ty < this.y - watch) {
          this.yvalue = -1;
          this.curY = margin;
        } else if (ty > this.y + this.h + watch) {
          this.yvalue = 1;
          this.curY = this.h - margin;
        } else {
          this.yvalue = p.map(
            ty,
            this.y - watch,
            this.y + this.h + watch,
            -1,
            1
          );
          this.curY = p.map(
            ty,
            this.y - watch,
            this.y + this.h + watch,
            margin,
            this.h - margin
          );
        }

        if (this.yvalue <= 0) {
          for (var _i4 = 0; _i4 < levels; _i4++) {
            var _perc2 = p.map(
              this.yvalue,
              -1,
              0,
              perc_min[_i4],
              default_perc * (_i4 + 1)
            );
            this.lines_up[_i4] = (this.curY / 100) * _perc2;
            this.lines_down[_i4] =
              this.curY + ((this.h - this.curY) / 100) * _perc2;
          }
        } else {
          for (var _i5 = 0; _i5 < levels; _i5++) {
            var _perc3 = p.map(
              this.yvalue,
              0,
              1,
              default_perc * (_i5 + 1),
              perc_max[_i5]
            );
            this.lines_up[_i5] = (this.curY / 100) * _perc3;
            this.lines_down[_i5] =
              this.curY + ((this.h - this.curY) / 100) * _perc3;
          }
        }

        this.lines_x[0] = 0;
        this.lines_y[0] = 0;

        for (var _i6 = 0; _i6 < levels; _i6++) {
          this.lines_x[_i6 + 1] = this.lines_left[_i6];
          this.lines_y[_i6 + 1] = this.lines_up[_i6];
        }

        this.lines_x[levels + 1] = this.curX;
        this.lines_y[levels + 1] = this.curY;

        for (var _i7 = levels + 2; _i7 < this.lines_x.length; _i7++) {
          this.lines_x[_i7] = this.lines_right[_i7 - levels - 2];
          this.lines_y[_i7] = this.lines_down[_i7 - levels - 2];
        }

        for (var _i8 = 0; _i8 <= this.lines_y.length - 1; _i8++) {
          for (var j = 0; j <= this.lines_x.length - 1; j++) {
            if (
              j === this.lines_x.length - 1 ||
              _i8 === this.lines_y.length - 1
            ) {
              if (
                j === this.lines_x.length - 1 &&
                _i8 !== this.lines_y.length - 1
              ) {
                p.image(
                  this.tiles[_i8][j],
                  this.lines_x[j] + this.x,
                  this.lines_y[_i8] + this.y,
                  this.w + this.x - (this.lines_x[j] + this.x),
                  this.lines_y[_i8 + 1] + this.y - (this.lines_y[_i8] + this.y)
                );
              } else if (
                j !== this.lines_x.length - 1 &&
                _i8 === this.lines_y.length - 1
              ) {
                p.image(
                  this.tiles[_i8][j],
                  this.lines_x[j] + this.x,
                  this.lines_y[_i8] + this.y,
                  this.lines_x[j + 1] + this.x - (this.lines_x[j] + this.x),
                  this.h + this.y - (this.lines_y[_i8] + this.y)
                );
              } else {
                p.image(
                  this.tiles[_i8][j],
                  this.lines_x[j] + this.x,
                  this.lines_y[_i8] + this.y,
                  this.w + this.x - (this.lines_x[j] + this.x),
                  this.h + this.y - (this.lines_y[_i8] + this.y)
                );
              }
            } else {
              p.image(
                this.tiles[_i8][j],
                this.lines_x[j] + this.x,
                this.lines_y[_i8] + this.y,
                this.lines_x[j + 1] + this.x - (this.lines_x[j] + this.x),
                this.lines_y[_i8 + 1] + this.y - (this.lines_y[_i8] + this.y)
              );
            }
          }
        }
      };
    }

    return Mesh;
  })();
}

function getObjectSizes(element) {
  var _element$getBoundingC = element.getBoundingClientRect(),
    width = _element$getBoundingC.width,
    height = _element$getBoundingC.height;

  return { width: width, height: height };
}
