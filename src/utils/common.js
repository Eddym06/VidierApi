/**
 * Deep merge two objects.
 * Source properties overwrite target properties.
 */
function deepMerge(target, source) {
    if (typeof target !== 'object' || target === null) {
        return source;
    }

    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]); // Recurse
                }
            } else {
                Object.assign(output, { [key]: source[key] }); // Overwrite
            }
        });
    }
    return output;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

module.exports = {
    deepMerge
};
