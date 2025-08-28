/**
 * 替换数组中符合条件的项，返回新数组
 * @param {Array} array - 原数组
 * @param {Function} predicate - 条件函数，返回 true 的项将被替换
 * @param {*|Function} replacement - 替换值或替换函数
 * @returns {Array} 返回新数组，原数组保持不变
 * 
 * @example
 * // 使用值替换
 * const arr = [1, 2, 3, 4, 5];
 * const result1 = replaceArrayItems(arr, x => x > 3, 0);
 * console.log(result1); // [1, 2, 3, 0, 0]
 * 
 * // 使用函数替换
 * const result2 = replaceArrayItems(arr, x => x > 3, x => x * 2);
 * console.log(result2); // [1, 2, 3, 8, 10]
 */
export function replaceArrayItems(array, predicate, replacement) {
    return array.map(item => {
        if (predicate(item)) {
            return typeof replacement === 'function' 
                ? replacement(item)
                : replacement;
        }
        return item;
    });
}

/**
 * 替换数组中第一个符合条件的项，返回新数组
 * @param {Array} array - 原数组
 * @param {Function} predicate - 条件函数，返回 true 的第一项将被替换
 * @param {*|Function} replacement - 替换值或替换函数
 * @returns {Array} 返回新数组，原数组保持不变
 * 
 * @example
 * const arr = [1, 2, 3, 4, 5];
 * const result = replaceFirstArrayItem(arr, x => x > 3, 0);
 * console.log(result); // [1, 2, 3, 0, 5]
 */
export function replaceFirstArrayItem(array, predicate, replacement) {
    const index = array.findIndex(predicate);
    if (index === -1) return [...array];
    
    const result = [...array];
    result[index] = typeof replacement === 'function'
        ? replacement(array[index])
        : replacement;
    
    return result;
}
