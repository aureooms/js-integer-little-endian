export function bdiv_t (lt, sub){

	/**
	 * Computes quotient and remainder of two big endian arrays.
	 * <p>
	 * Computes quotient and remainder of two big endian arrays
	 * using long division algorithm (the one teached in
	 * european primary schools).
	 *
	 * /!\ This algorithm modifies its first operand.
	 *
	 * HYP : q is at least as large as r
	 *       b is not zero
	 *
	 * @param {array} r dividend and remainder
	 * @param {int} ri r left
	 * @param {int} rj r right
	 * @param {array} b divisor
	 * @param {int} bi b left
	 * @param {int} bj b right
	 * @param {array} q quotient, must be 0 initialized
	 * @param {int} qi q left
	 */

	// /!\ There are implicit hypotheses
	//     made on the size of the operands.
	//     Should clarify.

	var div = function(r, ri, rj, b, bi, bj, q, qi){
		var k, t = ri + 1;

		do {

			// trim leading zeros
			//     - maybe could try to put this procedure inside the sub loop
			//     - or assume that the number is trimed at the begining
			//       and put this statement at the end of the main loop
			while (ri < rj && r[ri] === 0) ++ri;

			// search for a remainder block interval
			// greater than the divisor
			//     - maybe could try binary search on the lt function
			//     for another implementation
			k = ri + 1;
			while (k <= rj && lt(r, ri, k, b, bi, bj)) ++k;

			// remainder smaller than divisor --> end
			if (k > rj) break;

			// divide current block interval by quotient
			do{

				// increment quotient block corresponding
				// to current ls block of remainder interval
				++q[qi + k - t];

				// subtract divisor from current remainder
				// block interval
				sub(r, ri, k, b, bi, bj, r, ri, k);

			} while(!lt(r, ri, k, b, bi, bj));


		} while(true);

	};

	return div;

}
