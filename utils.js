export function rgbToHex(rgb) {
    const result = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/.exec(rgb);
    return result ? "#" + result.slice(1).map(n => parseInt(n).toString(16).padStart(2, '0')).join('') : rgb;
}
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
