// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  var expect,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  expect = chai.expect;

  describe("Helper Class", function() {
    var helper;

    helper = new Helper();
    describe(".getPage()", function() {
      var el, moveEvent;

      el = $("<div>");
      moveEvent = __indexOf.call(window, "ontouchstart") >= 0 ? "touchmove" : "mousemove";
      it("click イベントが発火しただけだし pageX は 0 が返ってくる", function() {
        el.on("click", function(event) {
          return expect(helper.getPage(event, "pageX")).to.equal(0);
        });
        return el.click();
      });
      it("" + moveEvent + " イベントが発火しただけだし pageY は 0 が返ってくる", function() {
        el.on(moveEvent, function(event) {
          return expect(helper.getPage(event, "pageY")).to.equal(0);
        });
        return el.click();
      });
      return it("全く関係ない load イベントとかで取得しようとしても undefined とかじゃね シラネ", function() {
        var evt;

        evt = document.createEvent("Event");
        evt.initEvent("load", false, false);
        return expect(helper.getPage(evt, "pageX")).to.be.a("undefined");
      });
    });
    describe(".hasProp()", function() {
      it("先行実装な CSS Property の配列を渡すと存在するかチェケラする。今どき transform ならあるよね", function() {
        var props;

        props = ["transformProperty", "WebkitTransform", "MozTransform", "OTransform", "msTransform"];
        return expect(helper.hasProp(props)).to.be["true"];
      });
      it("svgMatrixZ とかいうイミフな String を渡したら当然 false が返ってくる", function() {
        var prop;

        prop = "svgMatrixZ";
        return expect(helper.hasProp(prop)).to.be["false"];
      });
      return it("Array でも String でもないのを渡されても困るので TypeError を投げる", function() {
        return (expect(function() {
          return helper.hasProp(void 0);
        })).to["throw"](TypeError);
      });
    });
    describe(".setStyle()", function() {
      var el;

      el = document.createElement("div");
      beforeEach(function(done) {
        el.removeAttribute("style");
        helper.saveProp = {};
        return done();
      });
      it("display: none; を追加したから style=\"diplay: none;\" ってなってるはず", function() {
        helper.setStyle(el, {
          display: "block"
        });
        return expect(el.getAttribute("style")).to.equal("display: block;");
      });
      it("プロパティ複数指定したら、指定した順番に style 属性に入ってるはず", function() {
        helper.setStyle(el, {
          display: "none",
          width: "100px",
          height: "100px",
          margin: "0px auto"
        });
        return expect(el.getAttribute("style")).to.equal("display: none; width: 100px; height: 100px; margin: 0px auto;");
      });
      return it("prefix が必要なやつはプロパティはよしなに prefix つけて、よしなに纏めてくれるはず", function() {
        helper.setStyle(el, {
          width: "100px",
          height: "100px",
          transform: "translate(0, 0)",
          transitionTimingFunction: "ease",
          transitionDuration: "0ms"
        });
        return expect(el.getAttribute("style")).to.equal("width: 100px; height: 100px; -webkit-transform: translate(0, 0); transition: 0ms ease; -webkit-transition: 0ms ease;");
      });
    });
    describe(".getCSSVal()", function() {
      it("仮に webkit だとしたら、transform を入れると \"-webkit-transform\" が返ってくる", function() {
        expect(helper.getCSSVal("transform")).to.be.a("string");
        return expect(helper.getCSSVal("transform")).to.equal("-webkit-transform");
      });
      it("width とか prefix なしで余裕なプロパティいれるとありのまま木の実ナナで返ってくる", function() {
        expect(helper.getCSSVal("width")).to.be.a("string");
        return expect(helper.getCSSVal("width")).to.equal("width");
      });
      return it("うっかり配列とか入れたら TypeError 投げつけて激おこプンプン丸", function() {
        return (expect(function() {
          return helper.getCSSVal([1, 2, 3]);
        })).to["throw"](TypeError);
      });
    });
    describe(".ucFirst()", function() {
      it("\"webkitTransform\" とか渡すと \"WebkitTransform\" で返ってくる", function() {
        expect(helper.ucFirst("webkitTransform")).to.be.a("string");
        return expect(helper.ucFirst("webkitTransform")).to.equal("WebkitTransform");
      });
      it("String だけどアルファベットじゃない君 (\"123\") はありのままの君", function() {
        expect(helper.ucFirst("123")).to.be.a("string");
        return expect(helper.ucFirst("123")).to.equal("123");
      });
      return it("String じゃないものだったら TypeError 投げる", function() {
        return (expect(function() {
          return helper.ucFirst([1, 2, 3]);
        })).to["throw"](TypeError);
      });
    });
    describe(".triggerEvent()", function() {
      var el;

      el = document.createElement("div");
      it("hoge イベントでも意味なく発火させてみる", function() {
        var eventName, firedFlag,
          _this = this;

        eventName = "hoge";
        this.event = null;
        firedFlag = false;
        el.addEventListener(eventName, function(event) {
          _this.event = event;
          return firedFlag = true;
        }, false);
        helper.triggerEvent(el, eventName, true, false);
        expect(this.event.type).to.equal(eventName);
        expect(this.event.bubbles).to.be["true"];
        expect(this.event.cancelable).to.be["false"];
        expect(this.event.data).to.be.a("undefined");
        return expect(firedFlag).to.be["true"];
      });
      it("event 発火と同時にひっさげた data がちゃんと取得できるかな", function() {
        var eventName, firedFlag,
          _this = this;

        eventName = "dataTest";
        this.event = null;
        firedFlag = false;
        el.addEventListener(eventName, function(event) {
          _this.event = event;
          return firedFlag = true;
        }, false);
        helper.triggerEvent(el, eventName, true, false, {
          id: 300,
          name: "山田太郎",
          hasYaruki: null
        });
        expect(this.event.type).to.equal(eventName);
        expect(this.event.bubbles).to.be["true"];
        expect(this.event.cancelable).to.be["false"];
        expect(this.event.id).to.equal(300);
        expect(this.event.name).to.equal("山田太郎");
        expect(this.event.hasYaruki).to.be["null"];
        return expect(firedFlag).to.be["true"];
      });
      return it("対象となる要素の指定がちゃんとされてないと Error を投げる", function() {
        var eventName, firedFlag,
          _this = this;

        eventName = "errTest";
        this.event = null;
        firedFlag = false;
        el.addEventListener(eventName, function(event) {
          _this.event = event;
          return firedFlag = true;
        }, false);
        return (expect(function() {
          return helper.triggerEvent("el", eventName, true, false);
        })).to["throw"](Error);
      });
    });
    describe(".checkBrowser()", function() {
      var spoofUserAgent;

      spoofUserAgent = function(ua) {
        var _navigator;

        _navigator = window.navigator;
        window.navigator = new Object();
        window.navigator.__proto__ = _navigator;
        return window.navigator.__defineGetter__("userAgent", function() {
          return ua;
        });
      };
      describe("iOS 6.1.3 で試してみました", function() {
        spoofUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329");
        it("name: \"ios\" が返ってくる", function() {
          expect(helper.checkBrowser().name).to.be.a("string");
          return expect(helper.checkBrowser().name).to.equal("ios");
        });
        it("version: 6.1 が返ってくる", function() {
          expect(helper.checkBrowser().version).to.be.a("number");
          return expect(helper.checkBrowser().version).to.equal(6.1);
        });
        return it("特にレガシーなわけでもないので isLegacy: false が返ってくる", function() {
          return expect(helper.checkBrowser().isLegacy).to.be["false"];
        });
      });
      describe("Android 4.0.2 で試してみました", function() {
        before(function() {
          return spoofUserAgent("Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30");
        });
        it("name: \"android\" が返ってくる", function() {
          expect(helper.checkBrowser().name).to.be.a("string");
          return expect(helper.checkBrowser().name).to.equal("android");
        });
        it("version: 4 が返ってくる", function() {
          expect(helper.checkBrowser().version).to.be.a("number");
          return expect(helper.checkBrowser().version).to.equal(4);
        });
        return it("特にレガシーなわけでもないので isLegacy: false が返ってくる", function() {
          return expect(helper.checkBrowser().isLegacy).to.be["false"];
        });
      });
      return describe("Android 2.3.6 で試してみました", function() {
        before(function() {
          return spoofUserAgent("Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1");
        });
        it("name: \"android\" が返ってくる", function() {
          expect(helper.checkBrowser().name).to.be.a("string");
          return expect(helper.checkBrowser().name).to.equal("android");
        });
        it("version: 2.3 が返ってくる", function() {
          expect(helper.checkBrowser().version).to.be.a("number");
          return expect(helper.checkBrowser().version).to.equal(2.3);
        });
        return it("Android 2.x とかレガシーでとてもク◯ソなので isLegacy: true が返ってくる", function() {
          return expect(helper.checkBrowser().isLegacy).to.be["true"];
        });
      });
    });
    describe(".checkSupport()", function() {
      var hasTouch;

      hasTouch = helper.checkSupport().touch;
      return describe("WebKit 前提でございやんす", function() {
        if (hasTouch) {
          it("タッチイベントもってるから touch: true が返ってくる", function() {
            return expect(helper.checkSupport().touch).to.be["true"];
          });
        } else {
          it("タッチイベントもってないから touch: false が返ってくる", function() {
            return expect(helper.checkSupport().touch).to.be["false"];
          });
        }
        it("天下の WebKit さんなら Transform3d くらい対応してるはず", function() {
          return expect(helper.checkSupport().transform3d).to.be["true"];
        });
        return it("Transform3d に対応してる、すなわち cssAnimation: true が返ってくる", function() {
          return expect(helper.checkSupport().cssAnimation).to.be["true"];
        });
      });
    });
    return describe(".checkTouchEvents()", function() {
      var hasTouch;

      hasTouch = helper.checkSupport().touch;
      if (hasTouch) {
        return describe("タッチイベント持っていますね", function() {
          it("なもんで start: \"touchstart\" が返ってくる", function() {
            return expect(helper.checkTouchEvents().start).to.equal("touchstart");
          });
          it("なもんで move: \"touchmove\" が返ってくる", function() {
            return expect(helper.checkTouchEvents().move).to.equal("touchmove");
          });
          return it("なもんで end: \"touchend\" が返ってくる", function() {
            return expect(helper.checkTouchEvents().end).to.equal("touchend");
          });
        });
      } else {
        return describe("タッチイベント持ってませんね", function() {
          it("なもんで start: \"mousedown\" が返ってくる", function() {
            return expect(helper.checkTouchEvents().start).to.equal("mousedown");
          });
          it("なもんで move: \"mousemove\" が返ってくる", function() {
            return expect(helper.checkTouchEvents().move).to.equal("mousemove");
          });
          return it("なもんで end: \"mouseup\" が返ってくる", function() {
            return expect(helper.checkTouchEvents().end).to.equal("mouseup");
          });
        });
      }
    });
  });

}).call(this);
