"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.bkaratsuba_t = bkaratsuba_t;
/**
 * /!\ BLOCK MULTIPLICATION RESULT MUST HOLD IN THE JAVASCRIPT NUMBER TYPE (DOUBLE i.e. 53 bits)
 *
 * EXPLANATION
 * ###########
 *
 * We consider the numbers a and b, both of size N = 2n.
 *
 * We divide a and b into their lower and upper parts.
 *
 * a = a1 r^{n} + a0 (1)
 * b = b1 r^{n} + b0 (2)
 *
 * We express the product of a and b using their lower and upper parts.
 *
 * a b = (a1 r^{n} + a0) (b1 r^{n} + b0) (3)
 *     = a1 b1 r^{2n} + (a1 b0 + a0 b1) r^{n} + a0 b0 (4)
 *
 * This gives us 4 multiplications with operands of size n.
 * Using a simple trick, we can reduce this computation to 3 multiplications.
 *
 * We give the 3 terms of (4) the names z0, z1 and z2.
 *
 * z2 = a1 b1
 * z1 = a1 b0 + a0 b1
 * z0 = a0 b0
 *
 * a b  = z2 r^{2n} + z1 r^{n} + z0
 *
 * We then express z1 using z0, z2 and one additional multiplication.
 *
 * (a1 + a0)(b1 + b0) = a1 b1 + a0 b0 + (a1 b0 + a0 b1)
 *                    = z2 + z0 + z1
 *
 * z1 = (a1 + a0)(b1 + b0) - z2 - z0
 *
 * AN ANOTHER WAY AROUND (not used here)
 *
 * (a1 - a0)(b1 - b0) = (a1 b1 + a0 b0) - (a1 b0 + a0 b1)
 * (a0 - a1)(b1 - b0) = (a1 b0 + a0 b1) - (a1 b1 + a0 b0)
 * a b = (r^{2n} + r^{n})a1 b1 + r^{n}(a0 - a1)(b1 - b0) + (r^{n} + 1)a0 b0
 *
 * This algorithm is a generalization of the Toom-Cook algorithm, when m = n = 2.
 *
 * For further reference, see
 *  - http://en.wikipedia.org/wiki/Karatsuba_algorithm
 *  - http://en.wikipedia.org/wiki/Toom–Cook_multiplication
 *
 * @param {function} add addition algorithm
 * @param {function} sub subtraction algorithm
 * @param {function} mul multiplication algorithm
 * @param {function} calloc array allocator
 * @param {function} mov copy algorithm
 * @param {uint} r base (radix)
 * @param {function} wrap recursive multiplication algorithm
 *
 */

function bkaratsuba_t(add, sub, mul, calloc, mov, r, wrap) {

	/**
  * Multiply two big endian arrays using karatsuba algorithm,
  * i >= j, k >= 2 * i
  *
  *
  * @param {array} a first operand
  * @param {int} ai a left
  * @param {int} aj a right
  * @param {array} b second operand
  * @param {int} bi b left
  * @param {int} bj b right
  * @param {array} c result, must be 0 initialized
  * @param {int} ci c left
  * @param {int} cj c right
  */

	var karatsuba = function karatsuba(a, ai, aj, b, bi, bj, c, ci, cj) {

		var z0, z2, t1, t2, t3, n, I, N, N_, i_, j_, i, j, k;

		i = aj - ai;
		j = bj - bi;
		k = cj - ci;

		// EMPTY CASE
		if (i <= 0 || j <= 0 || k <= 0) return;

		// BASE CASE i = j = 1
		if (i === 1) {

			z0 = a[ai] * b[bi];
			c[cj - 1] = z0 % r;

			if (k > 1) {
				c[cj - 2] = (z0 - c[cj - 1]) / r;
			}
		}

		// RECURSION
		else {
				n = Math.ceil(i / 2);
				I = i + j;
				N = 2 * n;
				N_ = I - N;
				i_ = aj - n;
				j_ = Math.max(bi, bj - n);

				t1 = calloc(n + 1); // + 1 to handle addition overflows
				t2 = calloc(n + 1); // and guarantee reducing k for the
				t3 = calloc(N + 1); // recursive calls
				z2 = calloc(N_);
				z0 = calloc(N);

				// RECURSIVE CALLS
				mul(a, ai, i_, b, bi, j_, z2, 0, N_); // z2 = a1.b1
				mul(a, i_, aj, b, j_, bj, z0, 0, N); // z0 = a0.b0
				add(a, i_, aj, a, ai, i_, t1, 0, n + 1); // (a0 + a1)
				add(b, bi, j_, b, j_, bj, t2, 0, n + 1); // (b1 + b0)
				mul(t1, 1, n + 1, t2, 1, n + 1, t3, 1, N + 1); // (a0 + a1)(b1 + b0)

				// BUILD OUTPUT
				mov(z2, 0, N_, c, cj - I); // + z2 . r^{2n}
				mov(z0, 0, N, c, cj - N); // + z0

				if (t1[0]) {
					// overflow on t1, add t2 . r^{n}
					add(t3, 0, N + 1 - n, t2, 1, n + 1, t3, 0, N + 1 - n);
				}

				if (t2[0]) {
					// overflow on t2, add t1 . r^{n}
					add(t3, 0, N + 1 - n, t1, 1, n + 1, t3, 0, N + 1 - n);
				}

				if (t1[0] && t2[0]) {
					// overflow on t1 and t2, add 1 . r^{n+1}
					add(t3, 0, N - n, t1, 0, 1, t3, 0, N - n);
				}

				add(c, ci, cj - n, t3, 0, N + 1, c, ci, cj - n); // + (a0 + a1)(b1 + b0) . r^{n}
				sub(c, ci, cj - n, z2, 0, N_, c, ci, cj - n); // - z2 . r^{n}
				sub(c, ci, cj - n, z0, 0, N, c, ci, cj - n); // - z1 . r^{n}
			}
	};

	if (wrap !== undefined) karatsuba = wrap(karatsuba);
	if (mul === undefined) mul = karatsuba;

	return karatsuba;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy8wLWxlZ2FjeS9hcml0aG1ldGljL211bC9rYXJhdHN1YmEuanMiXSwibmFtZXMiOlsiYmthcmF0c3ViYV90IiwiYWRkIiwic3ViIiwibXVsIiwiY2FsbG9jIiwibW92IiwiciIsIndyYXAiLCJrYXJhdHN1YmEiLCJhIiwiYWkiLCJhaiIsImIiLCJiaSIsImJqIiwiYyIsImNpIiwiY2oiLCJ6MCIsInoyIiwidDEiLCJ0MiIsInQzIiwibiIsIkkiLCJOIiwiTl8iLCJpXyIsImpfIiwiaSIsImoiLCJrIiwiTWF0aCIsImNlaWwiLCJtYXgiLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMERnQkEsWSxHQUFBQSxZO0FBMURoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBETyxTQUFTQSxZQUFULENBQXVCQyxHQUF2QixFQUE0QkMsR0FBNUIsRUFBaUNDLEdBQWpDLEVBQXNDQyxNQUF0QyxFQUE4Q0MsR0FBOUMsRUFBbURDLENBQW5ELEVBQXNEQyxJQUF0RCxFQUEyRDs7QUFFakU7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsS0FBSUMsWUFBWSxtQkFBU0MsQ0FBVCxFQUFZQyxFQUFaLEVBQWdCQyxFQUFoQixFQUFvQkMsQ0FBcEIsRUFBdUJDLEVBQXZCLEVBQTJCQyxFQUEzQixFQUErQkMsQ0FBL0IsRUFBa0NDLEVBQWxDLEVBQXNDQyxFQUF0QyxFQUF5Qzs7QUFFeEQsTUFBSUMsRUFBSixFQUFRQyxFQUFSLEVBQVlDLEVBQVosRUFBZ0JDLEVBQWhCLEVBQW9CQyxFQUFwQixFQUF3QkMsQ0FBeEIsRUFBMkJDLENBQTNCLEVBQThCQyxDQUE5QixFQUFpQ0MsRUFBakMsRUFBcUNDLEVBQXJDLEVBQXlDQyxFQUF6QyxFQUE2Q0MsQ0FBN0MsRUFBZ0RDLENBQWhELEVBQW1EQyxDQUFuRDs7QUFFQUYsTUFBSWxCLEtBQUtELEVBQVQ7QUFDQW9CLE1BQUloQixLQUFLRCxF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U0FBWixFQUF1QmhDLE1BQU1LLFNBQU47O0FBRXZCLFFBQU9BLFNBQVA7QUFFQSIsImZpbGUiOiJrYXJhdHN1YmEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIC8hXFwgQkxPQ0sgTVVMVElQTElDQVRJT04gUkVTVUxUIE1VU1QgSE9MRCBJTiBUSEUgSkFWQVNDUklQVCBOVU1CRVIgVFlQRSAoRE9VQkxFIGkuZS4gNTMgYml0cylcbiAqXG4gKiBFWFBMQU5BVElPTlxuICogIyMjIyMjIyMjIyNcbiAqXG4gKiBXZSBjb25zaWRlciB0aGUgbnVtYmVycyBhIGFuZCBiLCBib3RoIG9mIHNpemUgTiA9IDJuLlxuICpcbiAqIFdlIGRpdmlkZSBhIGFuZCBiIGludG8gdGhlaXIgbG93ZXIgYW5kIHVwcGVyIHBhcnRzLlxuICpcbiAqIGEgPSBhMSByXntufSArIGEwICgxKVxuICogYiA9IGIxIHJee259ICsgYjAgKDIpXG4gKlxuICogV2UgZXhwcmVzcyB0aGUgcHJvZHVjdCBvZiBhIGFuZCBiIHVzaW5nIHRoZWlyIGxvd2VyIGFuZCB1cHBlciBwYXJ0cy5cbiAqXG4gKiBhIGIgPSAoYTEgcl57bn0gKyBhMCkgKGIxIHJee259ICsgYjApICgzKVxuICogICAgID0gYTEgYjEgcl57Mm59ICsgKGExIGIwICsgYTAgYjEpIHJee259ICsgYTAgYjAgKDQpXG4gKlxuICogVGhpcyBnaXZlcyB1cyA0IG11bHRpcGxpY2F0aW9ucyB3aXRoIG9wZXJhbmRzIG9mIHNpemUgbi5cbiAqIFVzaW5nIGEgc2ltcGxlIHRyaWNrLCB3ZSBjYW4gcmVkdWNlIHRoaXMgY29tcHV0YXRpb24gdG8gMyBtdWx0aXBsaWNhdGlvbnMuXG4gKlxuICogV2UgZ2l2ZSB0aGUgMyB0ZXJtcyBvZiAoNCkgdGhlIG5hbWVzIHowLCB6MSBhbmQgejIuXG4gKlxuICogejIgPSBhMSBiMVxuICogejEgPSBhMSBiMCArIGEwIGIxXG4gKiB6MCA9IGEwIGIwXG4gKlxuICogYSBiICA9IHoyIHJeezJufSArIHoxIHJee259ICsgejBcbiAqXG4gKiBXZSB0aGVuIGV4cHJlc3MgejEgdXNpbmcgejAsIHoyIGFuZCBvbmUgYWRkaXRpb25hbCBtdWx0aXBsaWNhdGlvbi5cbiAqXG4gKiAoYTEgKyBhMCkoYjEgKyBiMCkgPSBhMSBiMSArIGEwIGIwICsgKGExIGIwICsgYTAgYjEpXG4gKiAgICAgICAgICAgICAgICAgICAgPSB6MiArIHowICsgejFcbiAqXG4gKiB6MSA9IChhMSArIGEwKShiMSArIGIwKSAtIHoyIC0gejBcbiAqXG4gKiBBTiBBTk9USEVSIFdBWSBBUk9VTkQgKG5vdCB1c2VkIGhlcmUpXG4gKlxuICogKGExIC0gYTApKGIxIC0gYjApID0gKGExIGIxICsgYTAgYjApIC0gKGExIGIwICsgYTAgYjEpXG4gKiAoYTAgLSBhMSkoYjEgLSBiMCkgPSAoYTEgYjAgKyBhMCBiMSkgLSAoYTEgYjEgKyBhMCBiMClcbiAqIGEgYiA9IChyXnsybn0gKyByXntufSlhMSBiMSArIHJee259KGEwIC0gYTEpKGIxIC0gYjApICsgKHJee259ICsgMSlhMCBiMFxuICpcbiAqIFRoaXMgYWxnb3JpdGhtIGlzIGEgZ2VuZXJhbGl6YXRpb24gb2YgdGhlIFRvb20tQ29vayBhbGdvcml0aG0sIHdoZW4gbSA9IG4gPSAyLlxuICpcbiAqIEZvciBmdXJ0aGVyIHJlZmVyZW5jZSwgc2VlXG4gKiAgLSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0thcmF0c3ViYV9hbGdvcml0aG1cbiAqICAtIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVG9vbeKAk0Nvb2tfbXVsdGlwbGljYXRpb25cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhZGQgYWRkaXRpb24gYWxnb3JpdGhtXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdWIgc3VidHJhY3Rpb24gYWxnb3JpdGhtXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBtdWwgbXVsdGlwbGljYXRpb24gYWxnb3JpdGhtXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsb2MgYXJyYXkgYWxsb2NhdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBtb3YgY29weSBhbGdvcml0aG1cbiAqIEBwYXJhbSB7dWludH0gciBiYXNlIChyYWRpeClcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHdyYXAgcmVjdXJzaXZlIG11bHRpcGxpY2F0aW9uIGFsZ29yaXRobVxuICpcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gYmthcmF0c3ViYV90IChhZGQsIHN1YiwgbXVsLCBjYWxsb2MsIG1vdiwgciwgd3JhcCl7XG5cblx0LyoqXG5cdCAqIE11bHRpcGx5IHR3byBiaWcgZW5kaWFuIGFycmF5cyB1c2luZyBrYXJhdHN1YmEgYWxnb3JpdGhtLFxuXHQgKiBpID49IGosIGsgPj0gMiAqIGlcblx0ICpcblx0ICpcblx0ICogQHBhcmFtIHthcnJheX0gYSBmaXJzdCBvcGVyYW5kXG5cdCAqIEBwYXJhbSB7aW50fSBhaSBhIGxlZnRcblx0ICogQHBhcmFtIHtpbnR9IGFqIGEgcmlnaHRcblx0ICogQHBhcmFtIHthcnJheX0gYiBzZWNvbmQgb3BlcmFuZFxuXHQgKiBAcGFyYW0ge2ludH0gYmkgYiBsZWZ0XG5cdCAqIEBwYXJhbSB7aW50fSBiaiBiIHJpZ2h0XG5cdCAqIEBwYXJhbSB7YXJyYXl9IGMgcmVzdWx0LCBtdXN0IGJlIDAgaW5pdGlhbGl6ZWRcblx0ICogQHBhcmFtIHtpbnR9IGNpIGMgbGVmdFxuXHQgKiBAcGFyYW0ge2ludH0gY2ogYyByaWdodFxuXHQgKi9cblxuXHR2YXIga2FyYXRzdWJhID0gZnVuY3Rpb24oYSwgYWksIGFqLCBiLCBiaSwgYmosIGMsIGNpLCBjail7XG5cblx0XHR2YXIgejAsIHoyLCB0MSwgdDIsIHQzLCBuLCBJLCBOLCBOXywgaV8sIGpfLCBpLCBqLCBrO1xuXG5cdFx0aSA9IGFqIC0gYWk7XG5cdFx0aiA9IGJqIC0gYmk7XG5cdFx0ayA9IGNqIC0gY2k7XG5cblx0XHQvLyBFTVBUWSBDQVNFXG5cdFx0aWYgKGkgPD0gMCB8fCBqIDw9IDAgfHwgayA8PSAwKSByZXR1cm47XG5cblx0XHQvLyBCQVNFIENBU0UgaSA9IGogPSAxXG5cdFx0aWYgKGkgPT09IDEpIHtcblxuXHRcdFx0ejAgPSBhW2FpXSAqIGJbYmldO1xuXHRcdFx0Y1tjai0xXSA9IHowICUgcjtcblxuXHRcdFx0aWYgKGsgPiAxKSB7XG5cdFx0XHRcdGNbY2otMl0gPSAoejAgLSBjW2NqLTFdKSAvIHI7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBSRUNVUlNJT05cblx0XHRlbHNle1xuXHRcdFx0biAgPSBNYXRoLmNlaWwoaSAvIDIpO1xuXHRcdFx0SSAgPSBpICsgajtcblx0XHRcdE4gID0gMiAqIG47XG5cdFx0XHROXyA9IEkgLSBOO1xuXHRcdFx0aV8gPSBhaiAtIG47XG5cdFx0XHRqXyA9IE1hdGgubWF4KGJpLCBiaiAtIG4pO1xuXG5cdFx0XHR0MSA9IGNhbGxvYyhuICsgMSk7IC8vICsgMSB0byBoYW5kbGUgYWRkaXRpb24gb3ZlcmZsb3dzXG5cdFx0XHR0MiA9IGNhbGxvYyhuICsgMSk7IC8vIGFuZCBndWFyYW50ZWUgcmVkdWNpbmcgayBmb3IgdGhlXG5cdFx0XHR0MyA9IGNhbGxvYyhOICsgMSk7IC8vIHJlY3Vyc2l2ZSBjYWxsc1xuXHRcdFx0ejIgPSBjYWxsb2MoTl8pO1xuXHRcdFx0ejAgPSBjYWxsb2MoTik7XG5cblx0XHQvLyBSRUNVUlNJVkUgQ0FMTFNcblx0XHRcdG11bChhLCBhaSwgaV8sIGIsIGJpLCBqXywgejIsIDAsIE5fKTsgICAgICAgICAgICAvLyB6MiA9IGExLmIxXG5cdFx0XHRtdWwoYSwgaV8sIGFqLCBiLCBqXywgYmosIHowLCAwLCBOKTsgICAgICAgICAgICAgLy8gejAgPSBhMC5iMFxuXHRcdFx0YWRkKGEsIGlfLCBhaiwgYSwgYWksIGlfLCB0MSwgMCwgbiArIDEpOyAgICAgICAgIC8vIChhMCArIGExKVxuXHRcdFx0YWRkKGIsIGJpLCBqXywgYiwgal8sIGJqLCB0MiwgMCwgbiArIDEpOyAgICAgICAgIC8vIChiMSArIGIwKVxuXHRcdFx0bXVsKHQxLCAxLCBuICsgMSwgdDIsIDEsIG4gKyAxLCB0MywgMSwgTiArIDEpOyAgIC8vIChhMCArIGExKShiMSArIGIwKVxuXG5cdFx0Ly8gQlVJTEQgT1VUUFVUXG5cdFx0XHRtb3YoejIsIDAsIE5fLCBjLCBjaiAtIEkpOyAgICAgICAgICAgICAgICAgICAgICAgLy8gKyB6MiAuIHJeezJufVxuXHRcdFx0bW92KHowLCAwLCBOICwgYywgY2ogLSBOKTsgICAgICAgICAgICAgICAgICAgICAgIC8vICsgejBcblxuXHRcdFx0aWYgKHQxWzBdKSB7XG5cdFx0XHRcdC8vIG92ZXJmbG93IG9uIHQxLCBhZGQgdDIgLiByXntufVxuXHRcdFx0XHRhZGQodDMsIDAsIE4gKyAxIC0gbiwgdDIsIDEsIG4gKyAxLCB0MywgMCwgTiArIDEgLSBuKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQyWzBdKSB7XG5cdFx0XHRcdC8vIG92ZXJmbG93IG9uIHQyLCBhZGQgdDEgLiByXntufVxuXHRcdFx0XHRhZGQodDMsIDAsIE4gKyAxIC0gbiwgdDEsIDEsIG4gKyAxLCB0MywgMCwgTiArIDEgLSBuKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHQxWzBdICYmIHQyWzBdKSB7XG5cdFx0XHRcdC8vIG92ZXJmbG93IG9uIHQxIGFuZCB0MiwgYWRkIDEgLiByXntuKzF9XG5cdFx0XHRcdGFkZCh0MywgMCwgTiAtIG4sIHQxLCAwLCAxLCB0MywgMCwgTiAtIG4pO1xuXHRcdFx0fVxuXG5cdFx0XHRhZGQoYywgY2ksIGNqIC0gbiwgdDMsIDAsIE4gKyAxLCBjLCBjaSwgY2ogLSBuKTsgLy8gKyAoYTAgKyBhMSkoYjEgKyBiMCkgLiByXntufVxuXHRcdFx0c3ViKGMsIGNpLCBjaiAtIG4sIHoyLCAwLCBOXywgYywgY2ksIGNqIC0gbik7ICAgIC8vIC0gejIgLiByXntufVxuXHRcdFx0c3ViKGMsIGNpLCBjaiAtIG4sIHowLCAwLCBOLCBjLCBjaSwgY2ogLSBuKTsgICAgIC8vIC0gejEgLiByXntufVxuXHRcdH1cblxuXHR9O1xuXG5cdGlmICh3cmFwICE9PSB1bmRlZmluZWQpIGthcmF0c3ViYSA9IHdyYXAoa2FyYXRzdWJhKTtcblx0aWYgKG11bCA9PT0gdW5kZWZpbmVkKSBtdWwgPSBrYXJhdHN1YmE7XG5cblx0cmV0dXJuIGthcmF0c3ViYTtcblxufVxuIl19