// Generated by CoffeeScript 1.6.2
define(["zepto", "mocha", "chai", "../src/flickable"], function($, Mocha, Chai, Flickable, global, document) {
  var el, expect, flickable;

  if (global == null) {
    global = this;
  }
  if (document == null) {
    document = this.document;
  }
  "use strict";
  expect = Chai.expect;
  console.log(global);
  console.log(document);
  el = $("<div>")[0];
  flickable = new Flickable(el);
  console.log(Flickable);
  return console.log(flickable);
});