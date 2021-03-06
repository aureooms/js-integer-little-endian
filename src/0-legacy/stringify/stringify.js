
/**
 * Function template for number stringification.
 * Endianess provided by the iterator function
 *
 * @param {int} f from radix
 * @param {int} t to radix
 * @param {function} iter iterator function
 * @param {function} zfill_t zero fill string function
 */


export function stringify_t (f, t, iter, zfill_t){

	if(t <= f){

		if(t > 36) throw new Error('t > 36 not implemented');

		var z = 0;
		while(f >= t){
			if(f % t) break;
			f /= t;
			++z;
		}

		if(f !== 1) throw new Error('log(t) does not divide log(f) not implemented');

		var zfill = zfill_t(z);

		return function(a, i0, i1){
			var s = [];
			iter(i0, i1, function(i){
				s.push(zfill(Number(+a[i]).toString(t)));
			});
			return s.join('');
		};

	}
	else throw new Error('t > f not implemented');

}
