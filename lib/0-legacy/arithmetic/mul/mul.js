"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bmul_t = bmul_t;
function bmul_t(r) {

	/**
  * Computes product of two big endian arrays.
  * <p>
  * Computes product of two big endian arrays
  * using long multiplication algorithm (the one teached in
  * european primary schools)
  */

	var mul = function mul(a, ai, aj, b, bi, bj, c, ci, cj) {
		var ak,
		    ck = --cj,
		    ct,
		    t,
		    u,
		    v,
		    w,
		    y,
		    z;

		while (bj-- > bi && ck >= ci) {
			for (ak = aj, w = 0; ak-- > ai && ck >= ci; --ck) {
				t = b[bj] * a[ak];
				u = t % r;
				v = c[ck] + u + w;

				y = v % r;

				c[ck] = y;

				z = (v - y) / r;

				for (ct = ck - 1; z > 0 && ct >= ci; --ct) {
					v = c[ct] + z;
					y = v % r;
					c[ct] = y;
					z = (v - y) / r;
				}

				w = (t - u) / r;
			}
			ck = --cj;
		}
	};

	return mul;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy8wLWxlZ2FjeS9hcml0aG1ldGljL211bC9tdWwuanMiXSwibmFtZXMiOlsiYm11bF90IiwiciIsIm11bCIsImEiLCJhaSIsImFqIiwiYiIsImJpIiwiYmoiLCJjIiwiY2kiLCJjaiIsImFrIiwiY2siLCJjdCIsInQiLCJ1IiwidiIsInciLCJ5IiwieiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFDZ0JBLE0sR0FBQUEsTTtBQUFULFNBQVNBLE1BQVQsQ0FBaUJDLENBQWpCLEVBQW1COztBQUV6Qjs7Ozs7Ozs7QUFRQSxLQUFJQyxNQUFNLFNBQU5BLEdBQU0sQ0FBU0MsQ0FBVCxFQUFZQyxFQUFaLEVBQWdCQyxFQUFoQixFQUFvQkMsQ0FBcEIsRUFBdUJDLEVBQXZCLEVBQTJCQyxFQUEzQixFQUErQkMsQ0FBL0IsRUFBa0NDLEVBQWxDLEVBQXNDQyxFQUF0QyxFQUF5QztBQUNsRCxNQUFJQyxFQUFKO0FBQUEsTUFBUUMsS0FBSyxFQUFFRixFQUFmO0FBQUEsTUFBbUJHLEVBQW5CO0FBQUEsTUFBdUJDLENBQXZCO0FBQUEsTUFBMEJDLENBQTFCO0FBQUEsTUFBNkJDLENBQTdCO0FBQUEsTUFBZ0NDLENBQWhDO0FBQUEsTUFBbUNDLENBQW5DO0FBQUEsTUFBc0NDLENBQXRDOztBQUVBLFNBQU9aLE9BQU9ELEVBQVAsSUFBYU0sTUFBTUgsRUFBMUIsRUFBOEI7QUFDN0IsUUFBS0UsS0FBS1AsRUFBTCxFQUFTYSxJQUFJLENBQWxCLEVBQXFCTixPQUFPUixFQUFQLElBQWFTLE1BQU1ILEVBQXhDLEVBQTRDLEVBQUVHLEVBQTlDLEVBQWtEO0FBQ2pERSxRQUFJVCxFQUFFRSxFQUFGLElBQVFMLEVBQUVTLEVBQUYsQ0FBWjtBQUNBSSxRQUFJRCxJQUFJZCxDQUFSO0FBQ0FnQixRQUFJUixFQUFFSSxFQUFGLElBQVFHLENBQVIsR0FBWUUsQ0FBaEI7O0FBRUFDLFFBQUlGLElBQUloQixDQUFSOztBQUVBUSxNQUFFSSxFQUFGLElBQVFNLENBQVI7O0FBRUFDLFFBQUksQ0FBQ0gsSUFBSUUsQ0FBTCxJQUFVbEIsQ0FBZDs7QUFFQSxTQUFLYSxLQUFLRCxLQUFLLENBQWYsRUFBa0JPLElBQUksQ0FBSixJQUFTTixNQUFNSixFQUFqQyxFQUFxQyxFQUFFSSxFQUF2QyxFQUEyQztBQUMxQ0csU0FBSVIsRUFBRUssRUFBRixJQUFRTSxDQUFaO0FBQ0FELFNBQUlGLElBQUloQixDQUFSO0FBQ0FRLE9BQUVLLEVBQUYsSUFBUUssQ0FBUjtBQUNBQyxTQUFJLENBQUNILElBQUlFLENBQUwsSUFBVWxCLENBQWQ7QUFDQTs7QUFFRGlCLFFBQUksQ0FBQ0gsSUFBSUMsQ0FBTCxJQUFVZixDQUFkO0FBQ0E7QUFDRFksUUFBSyxFQUFFRixFQUFQO0FBQ0E7QUFDRCxFQTFCRDs7QUE0QkEsUUFBT1QsR0FBUDtBQUVBIiwiZmlsZSI6Im11bC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGZ1bmN0aW9uIGJtdWxfdCAocil7XG5cblx0LyoqXG5cdCAqIENvbXB1dGVzIHByb2R1Y3Qgb2YgdHdvIGJpZyBlbmRpYW4gYXJyYXlzLlxuXHQgKiA8cD5cblx0ICogQ29tcHV0ZXMgcHJvZHVjdCBvZiB0d28gYmlnIGVuZGlhbiBhcnJheXNcblx0ICogdXNpbmcgbG9uZyBtdWx0aXBsaWNhdGlvbiBhbGdvcml0aG0gKHRoZSBvbmUgdGVhY2hlZCBpblxuXHQgKiBldXJvcGVhbiBwcmltYXJ5IHNjaG9vbHMpXG5cdCAqL1xuXG5cdHZhciBtdWwgPSBmdW5jdGlvbihhLCBhaSwgYWosIGIsIGJpLCBiaiwgYywgY2ksIGNqKXtcblx0XHR2YXIgYWssIGNrID0gLS1jaiwgY3QsIHQsIHUsIHYsIHcsIHksIHo7XG5cblx0XHR3aGlsZSAoYmogLS0+IGJpICYmIGNrID49IGNpKSB7XG5cdFx0XHRmb3IgKGFrID0gYWosIHcgPSAwOyBhayAtLT4gYWkgJiYgY2sgPj0gY2k7IC0tY2spIHtcblx0XHRcdFx0dCA9IGJbYmpdICogYVtha107XG5cdFx0XHRcdHUgPSB0ICUgcjtcblx0XHRcdFx0diA9IGNbY2tdICsgdSArIHc7XG5cblx0XHRcdFx0eSA9IHYgJSByO1xuXG5cdFx0XHRcdGNbY2tdID0geTtcblxuXHRcdFx0XHR6ID0gKHYgLSB5KSAvIHI7XG5cblx0XHRcdFx0Zm9yIChjdCA9IGNrIC0gMTsgeiA+IDAgJiYgY3QgPj0gY2k7IC0tY3QpIHtcblx0XHRcdFx0XHR2ID0gY1tjdF0gKyB6O1xuXHRcdFx0XHRcdHkgPSB2ICUgcjtcblx0XHRcdFx0XHRjW2N0XSA9IHk7XG5cdFx0XHRcdFx0eiA9ICh2IC0geSkgLyByO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dyA9ICh0IC0gdSkgLyByO1xuXHRcdFx0fVxuXHRcdFx0Y2sgPSAtLWNqO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gbXVsO1xuXG59XG4iXX0=