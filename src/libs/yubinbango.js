
var t = [],
  YubinBango;
!(function (YubinBango) {
  var n = (function () {
    function n(t, n) {
      if (
        (void 0 === t && (t = ""),
        (this.URL = "https://yubinbango.github.io/yubinbango-data/data"),
        (this.g = [
          null,
          "北海道",
          "青森県",
          "岩手県",
          "宮城県",
          "秋田県",
          "山形県",
          "福島県",
          "茨城県",
          "栃木県",
          "群馬県",
          "埼玉県",
          "千葉県",
          "東京都",
          "神奈川県",
          "新潟県",
          "富山県",
          "石川県",
          "福井県",
          "山梨県",
          "長野県",
          "岐阜県",
          "静岡県",
          "愛知県",
          "三重県",
          "滋賀県",
          "京都府",
          "大阪府",
          "兵庫県",
          "奈良県",
          "和歌山県",
          "鳥取県",
          "島根県",
          "岡山県",
          "広島県",
          "山口県",
          "徳島県",
          "香川県",
          "愛媛県",
          "高知県",
          "福岡県",
          "佐賀県",
          "長崎県",
          "熊本県",
          "大分県",
          "宮崎県",
          "鹿児島県",
          "沖縄県",
        ]),
        t)
      ) {
        var e = t.replace(/[０-９]/g, function (t) {
            return String.fromCharCode(t.charCodeAt(0) - 65248);
          }),
          r = e.match(/\d/g),
          o = r.join(""),
          i = this.h(o);
        i ? this.i(i, n) : n(this.j());
      }
    }
    return (
      (n.prototype.h = function (t) {
        if (7 === t.length) return t;
      }),
      (n.prototype.j = function (t, n, e, r, o) {
        return (
          void 0 === t && (t = ""),
          void 0 === n && (n = ""),
          void 0 === e && (e = ""),
          void 0 === r && (r = ""),
          void 0 === o && (o = ""),
          { k: t, region: n, l: e, m: r, o: o }
        );
      }),
      (n.prototype.p = function (t) {
        return t && t[0] && t[1]
          ? this.j(t[0], this.g[t[0]], t[1], t[2], t[3])
          : this.j();
      }),
      (n.prototype.q = function (t, n) {
        window.$yubin = function (t) {
          return n(t);
        };
        var e = document.createElement("script");
        e.setAttribute("type", "text/javascript"),
          e.setAttribute("charset", "UTF-8"),
          e.setAttribute("src", t),
          document.head.appendChild(e);
      }),
      (n.prototype.i = function (n, e) {
        var r = this,
          o = n.substr(0, 3);
        return o in t && n in t[o]
          ? e(this.p(t[o][n]))
          : void this.q(this.URL + "/" + o + ".js", function (i) {
              return (t[o] = i), e(r.p(i[n]));
            });
      }),
      n
    );
  })();
  YubinBango.Core = n;
})(YubinBango || (YubinBango = {}));
var n = ["Japan", "JP", "JPN", "JAPAN"],
  e = [
    "p-region-id",
    "p-region",
    "p-locality",
    "p-street-address",
    "p-extended-address",
  ],
  YubinBango;
!(function (YubinBango) {
  var t = (function () {
    function t() {
      this.s();
    }
    return (
      (t.prototype.s = function () {
        var n = this,
          e = document.querySelectorAll(".h-adr");
        [].map.call(e, function (e) {
          if (n.t(e)) {
            var r = e.querySelectorAll(".p-postal-code");
            r[r.length - 1].addEventListener(
              "keyup",
              function (e) {
                t.prototype.u(n.v(e.target.parentNode));
              },
              !1
            );
          }
        });
      }),
      (t.prototype.v = function (t) {
        return "FORM" === t.tagName || t.classList.contains("h-adr")
          ? t
          : this.v(t.parentNode);
      }),
      (t.prototype.t = function (t) {
        var e = t.querySelector(".p-country-name"),
          r = [e.innerHTML, e.value];
        return r.some(function (t) {
          return n.indexOf(t) >= 0;
        });
      }),
      (t.prototype.u = function (t) {
        var n = this,
          e = t.querySelectorAll(".p-postal-code");
        new YubinBango.Core(this.A(e), function (e) {
          return n.B(t, e);
        });
      }),
      (t.prototype.A = function (t) {
        return [].map
          .call(t, function (t) {
            return t.value;
          })
          .reduce(function (t, n) {
            return t + n;
          });
      }),
      (t.prototype.B = function (t, n) {
        var r = [this.C, this.D];
        r.map(function (r) {
          return e.map(function (e) {
            return r(e, t, n);
          });
        });
      }),
      (t.prototype.C = function (t, n, e) {
        if (e) {
          var r = n.querySelectorAll("." + t);
          [].map.call(r, function (t) {
            return (t.value = "");
          });
        }
      }),
      (t.prototype.D = function (t, n, e) {
        var r = {
            "p-region-id": e.k,
            "p-region": e.region,
            "p-locality": e.l,
            "p-street-address": e.m,
            "p-extended-address": e.o,
          },
          o = n.querySelectorAll("." + t);
        [].map.call(o, function (n) {
          return (n.value += r[t] ? r[t] : "");
        });
      }),
      t
    );
  })();
  YubinBango.MicroformatDom = t;
})(YubinBango || (YubinBango = {})),
  document.addEventListener(
    "DOMContentLoaded",
    function () {
      new YubinBango.MicroformatDom();
    },
    !1
  );
//# sourceMappingURL=./yubinbango.js.map
