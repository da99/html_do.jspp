"use strict";


function Page_Type() {

  var me = this;
  this.targets = [];

  this.send_message = function send_message(msg) {
    var len = me.targets.length;
    for (var i = 0; i < len; i++) {
      me.targets[i](msg);
    }
    return msg.number;
  };

  this.add_receiver = function add_receiver(f) {
    me.targets.push(f);
    return me;
  }

} // === function Page

var Page = new Page_Type();

Page.add_receiver(function (msg) {
  if (!msg.number)
    return;
  document.getElementById("number").innerHTML = msg.number.toString();
});

function random_number () {
  var num = Math.random();
  return parseInt(num * 10000);
}

function now_string() {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
}

Page.add_receiver(function (msg) {
  if (msg.words && msg.number)
    document.querySelector("#words span").innerHTML = msg.words + "(" + msg.number + ")";
  document.querySelectorAll("#words span")[1].innerHTML = now_string();
});

Page.add_receiver(function (msg) {
  if (msg.quotation && msg.number)
    document.querySelector("#quotation").innerHTML = msg.quotation + ": Area " + msg.number;
});


