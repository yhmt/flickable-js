// Generated by CoffeeScript 1.6.2
define(function() {
  return (function(global, document) {
    var Helper;

    return Helper = (function() {
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
        var prop, _i, _len, _results;

        if (props instanceof Array) {
          _results = [];
          for (_i = 0, _len = props.length; _i < _len; _i++) {
            prop = props[_i];
            _results.push(this.div.style[prop] !== void 0);
          }
          return _results;
        } else if (typeof props === "string") {
          return this.div.style[prop] !== void 0;
        } else {
          return null;
        }
      };

      Helper.prototype.setStyle = function(style, prop, val) {
        var prefix, _i, _len, _prop, _ref, _saveProp;

        _saveProp = this.saveProp[prop];
        if (_saveProp) {
          return style[_saveProp] = val;
        } else if (style[prop] !== void 0) {
          this.saveProp[prop] = prop;
          return style[prop] = val;
        } else {
          _ref = this.prefixes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prefix = _ref[_i];
            _prop = this.ucFirst(prefix) + this.ucFirst(prop);
            if (style[_prop] !== void 0) {
              this.saveProp[prop] = _prop;
              style[_prop] = val;
              return true;
            }
          }
        }
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

      return Helper;

    })();
  })(this, this.document);
});
