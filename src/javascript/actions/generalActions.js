/**
 * Trigger reset for one or multiple variables from Redux store
 * @param type {String}
 * @returns {Function}
 */
export const resetItem = type => {
	return dispatch => {
		dispatch({ type: `RESET_${ type }` });
	};
};