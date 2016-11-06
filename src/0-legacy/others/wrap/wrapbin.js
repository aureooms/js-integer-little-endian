/**
 * Wrapper for binary operator.
 * Ensures
 *
 *     i >= j
 *     i0, j0, k0 >= 0
 *
 */

export function wrapbin (fn){

	return function(a, i0, i1, b, j0, j1, c, k0, k1){

		var i, j, k;

		k0 = Math.max(0, k0);
		k = k1 - k0;

		i0 = Math.max(0, i0, i1 - k);
		j0 = Math.max(0, j0, j1 - k);
		i = i1 - i0;
		j = j1 - j0;

		if(i < j)
		return fn(b, j0, j1, a, i0, i1, c, k0, k1);

		else
		return fn(a, i0, i1, b, j0, j1, c, k0, k1);
	};
}
