var getType = require('should-type');
var hasOwnProperty = Object.prototype.hasOwnProperty;


function eq(a, b, stackA, stackB) {
    // equal a and b exit early
    if (a === b) {
        // check for +0 !== -0;
        return a !== 0 || (1 / a == 1 / b);
    }

    var typeA = getType(a),
        typeB = getType(b);

    // if objects has different types they are not equals
    if (typeA !== typeB) return false;

    switch (typeA) {
        case 'number':
            return (a !== a) ? b !== b
                // but treat `+0` vs. `-0` as not equal
                : (a === 0 ? (1 / a === 1 / b) : a === b);

        case 'regexp':
            return String(a) === String(b);

        case 'boolean':
        case 'string':
            return a === b;

        case 'date':
            return +a === +b;

        case 'object-number':
        case 'object-boolean':
        case 'object-string':
            var isValueEqual = eq(a.valueOf(), b.valueOf(), stackA, stackB);
            if(isValueEqual) break;
            return false;

        case 'buffer':
            if(a.length !== b.length) return false;

            var l = a.length;
            while(l--) if(a[l] !== b[l]) return false;

            return true;

        case 'error':
            //only check not enumerable properties, and check arrays later
            if(a.name !== b.name || a.message !== b.message) return false;

            break;

        case 'array-buffer':
            if(a.byteLength !== b.byteLength) return false;

            if(typeof Int8Array !== 'undefined') {
                var viewA = new Int8Array(a);
                var viewB = new Int8Array(b);

                var l = a.byteLength;
                while(l--) if(a[l] !== b[l]) return false;

                return true;
            } else {
                return false;
            }

    }

    // compare deep objects and arrays
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
        if (stackA[length] == a) {
            return stackB[length] == b;
        }
    }

    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);

    var size = 0,
        result = true,
        key;

    if (typeA === 'array' || typeA === 'arguments') {
        if (a.length !== b.length) return false;
    }

    if (typeB === 'function') {
        if (a.toString() !== b.toString()) return false;
    }

    for (key in b) {
        if (hasOwnProperty.call(b, key)) {
            size++;

            result = result && hasOwnProperty.call(a, key) && eq(a[key], b[key], stackA, stackB);
            if(!result) return result;
        }
    }

    // ensure both objects have the same number of properties
    for (key in a) {
        if (hasOwnProperty.call(a, key)) {
            result = result && (--size > -1);
            if(!result) return result;
        }
    }

    stackA.pop();
    stackB.pop();

    if(typeB === 'function') {
        result = result && eq(a.prototype, b.prototype);
    }

    return result;
}


module.exports = eq;
