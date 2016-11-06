import test from 'ava' ;
import algo from 'aureooms-js-algo' ;
import string from 'aureooms-js-string' ;
import * as integer from '../../../src' ;

var check = function(Ctor, cmp, biter, div, sub, fiter){
	var name = `integer.div<${Ctor.name}, ${div[0]}, ${sub[0]},${cmp[0]}, ${biter[0]}, ${fiter[0]}>`;

	cmp = integer.wrapcmp(cmp[1]);
	biter = biter[1];
	div = div[1];
	sub = sub[1];
	fiter = fiter[1];

	var f = 16;
	var r = Math.pow(2, Ctor.BYTES_PER_ELEMENT * 8);

	// var toArray = function(a) {
	// 	var i, b = [];
	// 	for (i = 0; i < a.length; ++i) {
	// 		b.push(a[i]);
	// 	}
	// 	return b;
	// };

	var zfill_t = n => string.__lfill__(0,n,string.mul) ;

	var parse = integer.parse_t(r, f, biter);
	var stringify = integer.stringify_t(r, f, fiter, zfill_t);

	var lt = integer.lt_t(cmp);
	sub = sub(r);
	div = div(lt, sub);


	test(name, function(assert){


		for (var k = 0; k < TEST.length; ++k) {
			var test = TEST[k];

			var as = test[0];
			var ai = 0;
			var aj = Math.ceil(as.length * Math.log(f) / Math.log(r));
			var a = new Ctor(aj);
			var q = new Ctor(aj);
			parse(as, 0, as.length, a, ai, aj);


			var bs = test[1];
			var bi = 0;
			var bj = Math.ceil(bs.length * Math.log(f) / Math.log(r));
			var b = new Ctor(bj);
			parse(bs, 0, bs.length, b, bi, bj);
			// console.log("a", "b");
			// console.log(toArray(a), toArray(b));
			// console.log(stringify(a, ai, aj), stringify(b, bi, bj));

			div(a, ai, aj, b, bi, bj, q, ai);
			// console.log("q", "r");
			// console.log(toArray(q), toArray(a));
			// console.log(stringify(q, ai, aj), stringify(a, ai, aj));
			var qactual = parseInt(stringify(q, ai, aj), f);
			var qexpected = parseInt(test[2], f);
			var ractual = parseInt(stringify(a, ai, aj), f);
			var rexpected = parseInt(test[3], f);

			var a10 = parseInt(as, f);
			var b10 = parseInt(bs, f);

			assert.deepEqual(qactual, qexpected, `${a10} / ${b10} === ${qexpected}`);
			assert.deepEqual(ractual, rexpected, `${a10} / ${b10} === ${rexpected}`);
		}



	});

};

var TEST = [
	['0010', '4', '0004', '0000'],
	['0100', '10', '0010', '0000'],
	['0200', '20', '0010', '0000'],
	['0400', '10', '0040', '0000'],
	['fe01', 'ff', '00ff', '0000'],
	['fe0100', 'ff', '00ff00', '000000'],
	['27acdc40', '64c8', '000064c8', '00000000'],
	['27acdc3f', '64c8', '000064c7', '000064c7'],
	['27acdc41', '64c8', '000064c8', '00000001'],
	['27ad4108', '64c8', '000064c9', '00000000'],
	['27ad4107', '64c8', '000064c8', '000064c7'],

];


var TRAITS = [
	Uint8Array,
	Uint16Array,
	Uint32Array,
];

var ENDIANESS = [
	[
		['integer.bcmp_t', integer.bcmp_t()],
		['algo.biter', algo.biter],
		['algo.bdiv_t', integer.bdiv_t],
		['integer.bsub_t', integer.bsub_t],
		['algo.fiter', algo.fiter],
	],
	// [
	// 	['integer.lcmp_t', integer.lcmp_t()],
	// 	['algo.fiter', algo.fiter],
	// 	['algo.ldiv_t', algo.ldiv_t],
	// 	['integer.lsub_t', integer.lsub_t],
	// 	['algo.biter', algo.biter],
	// ],
];

for (var j = 0; j < ENDIANESS.length; ++j)
for (var i = 0; i < TRAITS.length; ++i)
	check.apply(null, [TRAITS[i]].concat(ENDIANESS[j]));
