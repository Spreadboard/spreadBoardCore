/**
 * Debounce
 * @see https://www.matthewgerstman.com/tech/throttle-and-debounce/
 * @param {Function} next
 * @param {number} ms
 * @return {Function}
 */
export default function debounce(next: Function, ms: number) {
    let timeout: any;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            next(...args);
        }, ms);
    };
}