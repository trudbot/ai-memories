export function isMain() {
    if (isBrowser()) {
        return false;
    }
    return (
        typeof process !== 'undefined' &&
        typeof require !== 'undefined' &&
        require.main === module
    )
}

export function isBrowser() {
    return typeof BROWSER !== 'undefined' && BROWSER;
}