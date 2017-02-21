'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.stringify = stringify;

var _ = require('./');

function stringify(f, t, a, ai, aj) {

	if (t > 36) throw 't > 36 not implemented';

	var b = (0, _.convert)(f, t, a, ai, aj);

	return (0, _._to_string)(b);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy8xLW5ldy9jb252ZXJ0L3N0cmluZ2lmeS5qcyJdLCJuYW1lcyI6WyJzdHJpbmdpZnkiLCJmIiwidCIsImEiLCJhaSIsImFqIiwiYiJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFFZ0JBLFMsR0FBQUEsUzs7QUFGaEI7O0FBRU8sU0FBU0EsU0FBVCxDQUFxQkMsQ0FBckIsRUFBeUJDLENBQXpCLEVBQTZCQyxDQUE3QixFQUFpQ0MsRUFBakMsRUFBc0NDLEVBQXRDLEVBQTJDOztBQUVqRCxLQUFLSCxJQUFJLEVBQVQsRUFBYyxNQUFNLHdCQUFOOztBQUVkLEtBQU1JLElBQUksZUFBU0wsQ0FBVCxFQUFhQyxDQUFiLEVBQWlCQyxDQUFqQixFQUFxQkMsRUFBckIsRUFBMEJDLEVBQTFCLENBQVY7O0FBRUEsUUFBTyxrQkFBWUMsQ0FBWixDQUFQO0FBRUEiLCJmaWxlIjoic3RyaW5naWZ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29udmVydCAsIF90b19zdHJpbmcgfSBmcm9tICcuLycgO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RyaW5naWZ5ICggZiAsIHQgLCBhICwgYWkgLCBhaiApIHtcblxuXHRpZiAoIHQgPiAzNiApIHRocm93ICd0ID4gMzYgbm90IGltcGxlbWVudGVkJyA7XG5cblx0Y29uc3QgYiA9IGNvbnZlcnQoIGYgLCB0ICwgYSAsIGFpICwgYWogKSA7XG5cblx0cmV0dXJuIF90b19zdHJpbmcoIGIgKSA7XG5cbn1cbiJdfQ==