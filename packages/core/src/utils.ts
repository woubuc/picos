/**
 * Flattens a potentially multi-dimensional array into a regular array
 *
 * @param arr - The source array to flatten
 *
 * @returns A regular, one-dimensional array containing all items from the source array
 */
export function flatten<T>(arr : (T | T[])[]) : T[] {
	return arr.reduce<T[]>((acc, i) => {
		if (Array.isArray(i)) {
			acc.push(...flatten(i));
		} else {
			acc.push(i);
		}
		return acc;
	}, []);
}
