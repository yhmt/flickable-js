// Generated by CoffeeScript 1.6.2
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    return define(NS, [], function() {
      factory(root, root.document);
      return root[NS];
    });
  } else {
    return factory(root, root.document);
  }
})(this, function(window, documentd) {
  var Flickable, Helper, NS;

  NS = "Flickable";
  Helper = (function() {
    function Helper() {
      this.div = document.createElement("div");
      this.prefixes = ["webkit", "moz", "o", "ms"];
      this.saveProp = {};
    }

    Helper.prototype.getPage = function(event, page) {
      if (event.changedTouches) {
        return event.changedTouches[0][page];
      } else {
        return event[page];
      }
    };

    Helper.prototype.hasProp = function(props) {
      var prop, _i, _len;

      if (props instanceof Array) {
        for (_i = 0, _len = props.length; _i < _len; _i++) {
          prop = props[_i];
          if (this.div.style[prop] !== void 0) {
            return true;
          }
        }
        return false;
      } else if (typeof props === "string") {
        if (this.div.style[prop] !== void 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return null;
      }
    };

    Helper.prototype.setStyle = function(element, styles) {
      var hasSaveProp, prop, set, style, _results,
        _this = this;

      style = element.style;
      hasSaveProp = this.saveProp[prop];
      set = function(style, prop, val) {
        var prefix, _i, _len, _prop, _ref;

        if (hasSaveProp) {
          return style[hasSaveProp] = val;
        } else if (style[prop] !== void 0) {
          _this.saveProp[prop] = prop;
          return style[prop] = val;
        } else {
          _ref = _this.prefixes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prefix = _ref[_i];
            _prop = _this.ucFirst(prefix) + _this.ucFirst(prop);
            if (style[_prop] !== void 0) {
              _this.saveProp[prop] = _prop;
              style[_prop] = val;
              return true;
            }
          }
          return false;
        }
      };
      _results = [];
      for (prop in styles) {
        _results.push(set(style, prop, styles[prop]));
      }
      return _results;
    };

    Helper.prototype.getCSSVal = function(prop) {
      var prefix, ret, _i, _len, _prop, _ref;

      if (typeof prop !== "string") {
        return null;
      } else if (this.div.style[prop] !== void 0) {
        return prop;
      } else {
        _ref = this.prefixes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prefix = _ref[_i];
          _prop = this.ucFirst(prefix) + this.ucFirst(prop);
          if (this.div.style[_prop] !== void 0) {
            ret = "-" + prefix + "-" + prop;
          }
        }
        return ret;
      }
    };

    Helper.prototype.ucFirst = function(str) {
      if (typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.substr(1);
      } else {
        return null;
      }
    };

    Helper.prototype.triggerEvent = function(element, type, bubbles, cancelable, data) {
      var d, event;

      event = document.createElement("Event");
      event.initEvent(type, bubbles, cancelable);
      if (data) {
        for (d in data) {
          event[d] = data[d];
        }
      }
      return element.dispatchEvent(event);
    };

    Helper.prototype.checkBrowser = function() {
      var android, browserName, browserVersion, ios, ua;

      ua = window.navigator.userAgent.toLowerCase();
      ios = ua.match(/(?:iphone\sos|ip[oa]d.*os)\s([\d_]+)/);
      android = ua.match(/(android)\s+([\d.]+)/);
      browserName = (function() {
        if (!!ios) {
          return "ios";
        } else if (!!android) {
          return "android";
        } else {
          return "pc";
        }
      })();
      browserVersion = (function() {
        var version;

        if (!ios && !android) {
          return null;
        }
        version = (ios || android).pop().split(/\D/).join(".");
        return parseFloat(version);
      })();
      return {
        name: browserName,
        version: browserVersion,
        isLegacy: !!android && browserVersion < 3
      };
    };

    Helper.prototype.checkSupport = function() {
      var hasTransform, hasTransform3d, hasTransition;

      hasTransform3d = this.hasProp(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "msPerspective", "OPerspective"]);
      hasTransform = this.hasProp(["transformProperty", "WebkitTransform", "MozTransform", "msTransform", "OTransform"]);
      hasTransition = this.hasProp(["transitionProperty", "WebkitTransitionProperty", "MozTransitionProperty", "msTransitionProperty", "OTransitionProperty"]);
      return {
        touch: "ontouchstart" in window,
        eventListener: "addEventListener" in window,
        transform3d: hasTransform3d,
        transform: hasTransform,
        transition: hasTransition,
        cssAnimation: (function() {
          if (hasTransform3d || hasTransform && hasTransition) {
            return true;
          } else {
            return false;
          }
        })()
      };
    };

    Helper.prototype.checkEvents = function() {
      var hasTouch;

      hasTouch = this.checkSupport.touch;
      return {
        start: hasTouch ? "touchstart" : "mousedown",
        move: hasTouch ? "touchmove" : "mousemove",
        end: hasTouch ? "touchend" : "mouseup"
      };
    };

    return Helper;

  })();
  Flickable = (function() {
    function Flickable(element, opts) {
      var _this = this;

      if (opts == null) {
        opts = {};
      }
      this.el = element;
      this.opts = opts;
      this.helper = new Helper();
      this.browser = this.helper.checkBrowser();
      this.support = this.helper.checkSupport();
      this.events = this.helper.checkEvents();
      if (typeof this.el === "string") {
        this.el = document.querySelector(el);
      } else if (!this.el) {
        throw new Error("Element Not Found");
      }
      this.distance = this.opts.distance || null;
      this.maxPoint = this.opts.maxPoint || null;
      this.currentPoint = this.currentX = this.maxX = 0;
      this.scrolling = this.moveReady = this.startPageX = this.startPageY = this.basePageX = this.startTime = null;
      this.gestureStart = false;
      this.opts.use3d = this.opts.disable3d ? false : this.support.transform3d;
      this.opts.useJsAnimate = false;
      this.opts.disableTouch = this.opts.disableTouch || false;
      this.opts.disable3d = this.opts.disable3d || false;
      this.opts.transition = this.opts.transition || {};
      this.opts.transition = {
        timingFunction: this.opts.transition["timingFunction"] || "cubic-bezier(0.23, 1, 0.32, 1)",
        duration: (function() {
          return _this.opts.transition["duration"] || (_this.browser.isLegacy ? "200ms" : "330ms");
        })()
      };
      if (this.support.cssAnimation) {
        this.helper.setStyle(this.el, {
          transitionProperty: this.helper.getCSSVal("transform"),
          transitionDuration: "0ms",
          transitionTimingFunction: this.opts.transition["timingFunction"],
          transform: this._getTranslate(0)
        });
      } else {
        this.helper.setStyle(this.el, {
          position: "relative",
          left: "0px"
        });
      }
      if (this.support.eventListener) {
        document.addEventListener("gesturestart", function() {
          return _this.gestureStart = true;
        });
        document.addEventListener("gestureend", function() {
          return _this.gestureStart = false;
        });
      }
      this.el.addEventListener(this.events.start, this, false);
      this.refresh();
    }

    Flickable.prototype.handleEvent = function(event) {
      switch (event["typeof"]) {
        case this.events.start:
          return this._touchStart(event);
        case this.events.move:
          return this._touchMove(event);
        case this.events.end:
          return this._touchEnd(event);
        case "click":
          return this._click(event);
      }
    };

    Flickable.prototype.refresh = function() {
      var _this = this;

      this.maxPoint = (function() {
        var childNodes, itemLength, node, _i, _len;

        if (_this.maxPoint === null) {
          childNodes = _this.el.childNodes;
          itemLength = 0;
          for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
            node = childNodes[_i];
            if (node.nodeType === 1) {
              itemLength++;
            }
          }
          if (itemLength > 0) {
            return itemLength--;
          }
        } else {
          return _this.maxPoint;
        }
      })();
      this.distance = (function() {
        if (_this.distance === null) {
          return _this.el.scrollWidth / (_this.maxPoint + 1);
        } else {
          return _this.distance;
        }
      })();
      this.maxX = "-" + (this.distance * this.maxPoint);
      return this.moveToPoint();
    };

    Flickable.prototype.hasPrev = function() {
      return this.currentPoint > 0;
    };

    Flickable.prototype.hasNext = function() {
      return this.currentPoint < this.maxPoint;
    };

    Flickable.prototype.toPrev = function() {
      if (!this.hasPrev()) {
        return;
      }
      return this.moveToPoint(this.currentPoint - 1);
    };

    Flickable.prototype.toNext = function() {
      if (!this.hasNext()) {
        return;
      }
      return this.moveToPoint(this.currentPoint + 1);
    };

    Flickable.prototype.moveToPoint = function(point, duration) {
      var beforePoint;

      if (point == null) {
        point = this.currentPoint;
      }
      if (duration == null) {
        duration = this.opts.transition["duration"];
      }
      beforePoint = this.currentPoint;
      if (point < 0) {
        this.currentPoint = 0;
      } else if (point > this.maxPoint) {
        this.currentPoint = this.maxPoint;
      } else {
        this.currentPoint = parseInt(point, 10);
      }
      if (this.support.cssAnimation) {
        this.helper.setStyle(this.el, {
          transitionDuration: duration
        });
      } else {
        this.opts.useJsAnimate = true;
      }
      return this._setX("-" + (this.currentPoint * this.distance), duration);
    };

    Flickable.prototype._setX = function(x, duration) {
      if (duration == null) {
        duration = this.opts.transition["duration"];
      }
      this.currentX = x;
      if (this.support.cssAnimation) {
        return this.helper.setStyle(this.el, {
          transform: this._getTranslate(x)
        });
      } else if (this.opts.useJsAnimate) {
        return this._jsAnimate(x, duration);
      } else {
        return this.el.style.left = "" + x + "px";
      }
    };

    Flickable.prototype._touchStart = function(event) {
      if (this.opts.disableTouch || this.gestureStart) {
        return;
      }
      this.el.addEventListener(this.events.move, this, false);
      document.addEventListener(this.events.end, this, false);
      if (!this.events.touch) {
        event.preventDefault();
      }
      if (this.support.cssAnimation) {
        this.helper.setStyle(this.el, {
          transitionDuration: "0ms"
        });
      } else {
        this.opts.useJsAnimate = false;
      }
      this.scrolling = true;
      this.moveReady = false;
      this.startPageX = this.helper.getPage(event, "pageX");
      this.startPageY = this.helper.getPage(event, "pageY");
      this.basePageX = this.startPageX;
      this.directionX = 0;
      this.startTime = event.timeStamp;
      return this.helper.triggerEvent(this.el, "fltouchstart", true, false);
    };

    Flickable.prototype._touchMove = function(event) {
      var deltaX, deltaY, distX, isPrevent, newX, pageX, pageY,
        _this = this;

      if (!this.scrolling || this.gestureStart) {
        return;
      }
      pageX = this.helper.getPage(event, "pageX");
      pageY = this.helper.getPage(event, "pageY");
      if (this.moveReady) {
        event.preventDefault();
        event.stopPropagation();
        distX = pageX - this.basePageX;
        newX = this.currentX + distX;
        if (newX >= 0 || newX < this.maxX) {
          newX = Math.round(this.currentX + distX / 3);
        }
        this.directionX = (function() {
          if (distX === 0) {
            return _this.directionX;
          } else {
            if (distX > 0) {
              return -1;
            } else {
              return 1;
            }
          }
        })();
        isPrevent = !helper.triggerEvent(this.el, "fltouchmove", true, true, {
          delta: distX,
          direction: this.directionX
        });
        if (isPrevent) {
          this._touchAfter({
            moved: false,
            originalPoint: this.currentPoint,
            newPoint: this.currentPoint,
            cancelled: true
          });
        } else {
          this._setX(newX);
        }
      } else {
        deltaX = Math.abs(pageX - this.startPageX);
        deltaY = Math.abs(pageY - this.startPageY);
        if (deltaX > 5) {
          event.preventDefault();
          event.stopPropagation();
          this.moveReady = true;
          this.el.addEventListener("click", this, true);
        } else if (deltaY > 5) {
          this.scrolling = false;
        }
      }
      return this.basePageX = pageX;
    };

    Flickable.prototype._touchEnd = function(event) {
      var newPoint,
        _this = this;

      this.el.removeEventListener(this.events.move, this, false);
      document.removeEventListener(this.events.end, this, false);
      if (!this.scrolling) {
        return;
      }
      newPoint = (function() {
        var point;

        point = -_this.currentX / _this.distance;
        if (_this.directionX > 0) {
          return Math.ceil(point);
        } else if (_this.directionX < 0) {
          return Math.floor(point);
        } else {
          return Math.round(point);
        }
      })();
      if (newPoint < 0) {
        newPoint = 0;
      } else if (newPoint > this.maxPoint) {
        newPoint = this.maxPoint;
      }
      this._touchAfter({
        moved: newPoint !== this.currentPoint,
        originalPoint: this.currentPoint,
        newPoint: newPoint,
        cancelled: false
      });
      return this.moveToPoint(newPoint);
    };

    Flickable.prototype._touchAfter = function(params) {
      var _this = this;

      this.scrolling = false;
      this.moveReady = false;
      window.setTimeout(function() {
        return _this.el.removeEventListener("click", _this, true);
      }, 200);
      return this.helper.triggerEvent(this.el, "fltouchend", true, false, params);
    };

    Flickable.prototype._click = function(event) {
      event.stopPropagation();
      return event.preventDefault();
    };

    Flickable.prototype._getTranslate = function(x) {
      if (this.opts.use3d) {
        return "translate3d(" + x + "px, 0, 0)";
      } else {
        return "translate(" + x + "px, 0)";
      }
    };

    Flickable.prototype._jsAnimate = function(x, duration) {
      var begin, easing, from, timer, to;

      if (duration == null) {
        duration = this.opts.transition["duration"];
      }
      begin = +new Date();
      from = parseInt(this.el.style.left, 10);
      to = x;
      duration = parseInt(duration, 10);
      easing = function(time, duration) {
        return "-" + ((time /= duration) * (time - 2));
      };
      return timer = setInterval(function() {
        var now, pos, time;

        time = new Date() - begin;
        if (time > duration) {
          clearInterval(timer);
          now = to;
        } else {
          pos = easing(time, duration);
          now = pos * (to - from) + from;
        }
        return this.el.style.left = "" + now + "px";
      }, 10);
    };

    Flickable.prototype.destroy = function() {
      return this.el.removeEventListener(this.events.start, this, false);
    };

    return Flickable;

  })();
  return window[NS] = Flickable;
});
