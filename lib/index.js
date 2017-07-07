"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
exports._A = null;
function getFunctionName(f) {
    return f.displayName || f.name || "<function" + f.length + ">";
}
exports.getFunctionName = getFunctionName;
function getContextEntry(key, type) {
    return { key: key, type: type };
}
function getValidationError(value, context) {
    return { value: value, context: context };
}
function pushAll(xs, ys) {
    Array.prototype.push.apply(xs, ys);
}
function failure(value, context) {
    return new Either_1.Left([getValidationError(value, context)]);
}
exports.failure = failure;
function success(value) {
    return new Either_1.Right(value);
}
exports.success = success;
function getDefaultContext(type) {
    return [{ key: '', type: type }];
}
function validate(value, type) {
    return type.validate(value, getDefaultContext(type));
}
exports.validate = validate;
function is(value, type) {
    return Either_1.isRight(validate(value, type));
}
exports.is = is;
exports.URI = 'io-ts/Type';
function map(f, type) {
    return mapWithName(f, type, "(" + type.name + " => ?)");
}
exports.map = map;
function mapWithName(f, type, name) {
    return {
        _A: exports._A,
        _tag: 'MapType',
        name: name,
        validate: function (v, c) { return type.validate(v, c).map(f); },
        type: type,
        f: f
    };
}
exports.mapWithName = mapWithName;
var nullType = {
    _A: exports._A,
    _tag: 'NullType',
    name: 'null',
    validate: function (v, c) { return (v === null ? success(v) : failure(v, c)); }
};
exports.null = nullType;
var undefinedType = {
    _A: exports._A,
    _tag: 'UndefinedType',
    name: 'undefined',
    validate: function (v, c) { return (v === void 0 ? success(v) : failure(v, c)); }
};
exports.undefined = undefinedType;
exports.any = {
    _A: exports._A,
    _tag: 'AnyType',
    name: 'any',
    validate: function (v, _) { return success(v); }
};
exports.never = {
    _A: exports._A,
    _tag: 'NeverType',
    name: 'never',
    validate: function (v, c) { return failure(v, c); }
};
exports.string = {
    _A: exports._A,
    _tag: 'StringType',
    name: 'string',
    validate: function (v, c) { return (typeof v === 'string' ? success(v) : failure(v, c)); }
};
exports.number = {
    _A: exports._A,
    _tag: 'NumberType',
    name: 'number',
    validate: function (v, c) { return (typeof v === 'number' ? success(v) : failure(v, c)); }
};
exports.boolean = {
    _A: exports._A,
    _tag: 'BooleanType',
    name: 'boolean',
    validate: function (v, c) { return (typeof v === 'boolean' ? success(v) : failure(v, c)); }
};
var arrayType = {
    _A: exports._A,
    _tag: 'AnyArrayType',
    name: 'Array',
    validate: function (v, c) { return (Array.isArray(v) ? success(v) : failure(v, c)); }
};
exports.Array = arrayType;
exports.Dictionary = {
    _A: exports._A,
    _tag: 'AnyDictionaryType',
    name: 'Dictionary',
    validate: function (v, c) { return (v !== null && typeof v === 'object' ? success(v) : failure(v, c)); }
};
var functionType = {
    _A: exports._A,
    _tag: 'FunctionType',
    name: 'Function',
    validate: function (v, c) { return (typeof v === 'function' ? success(v) : failure(v, c)); }
};
exports.Function = functionType;
function refinement(type, predicate, name) {
    return {
        _A: exports._A,
        _tag: 'RefinementType',
        name: name || "(" + type.name + " | " + getFunctionName(predicate) + ")",
        validate: function (v, c) { return type.validate(v, c).chain(function (t) { return (predicate(t) ? success(t) : failure(v, c)); }); },
        type: type,
        predicate: predicate
    };
}
exports.refinement = refinement;
exports.Integer = refinement(exports.number, function (n) { return n % 1 === 0; }, 'Integer');
function prism(type, getOption, name) {
    return {
        _A: exports._A,
        _tag: 'PrismType',
        name: name || "Prism<" + type.name + ", ?>",
        validate: function (v, c) { return type.validate(v, c).chain(function (a) { return getOption(a).fold(function () { return failure(a, c); }, function (b) { return success(b); }); }); },
        type: type,
        getOption: getOption
    };
}
exports.prism = prism;
function literal(value) {
    return {
        _A: exports._A,
        _tag: 'LiteralType',
        name: JSON.stringify(value),
        validate: function (v, c) { return (v === value ? success(value) : failure(v, c)); },
        value: value
    };
}
exports.literal = literal;
function keyof(keys, name) {
    return {
        _A: exports._A,
        _tag: 'KeyofType',
        name: name || "(keyof " + JSON.stringify(Object.keys(keys)) + ")",
        validate: function (v, c) { return (keys.hasOwnProperty(v) ? success(v) : failure(v, c)); },
        keys: keys
    };
}
exports.keyof = keyof;
//
// recursive types
//
function recursion(name, definition) {
    var Self = { name: name, validate: function (v, c) { return Result.validate(v, c); } };
    var Result = definition(Self);
    Result.name = name;
    return Result;
}
exports.recursion = recursion;
function array(type, name) {
    return {
        _A: exports._A,
        _tag: 'ArrayType',
        name: name || "Array<" + type.name + ">",
        validate: function (v, c) {
            return arrayType.validate(v, c).chain(function (as) {
                var t = [];
                var errors = [];
                var changed = false;
                var _loop_1 = function (i) {
                    var a = as[i];
                    var validation = type.validate(a, c.concat(getContextEntry(String(i), type)));
                    validation.fold(function (error) { return pushAll(errors, error); }, function (va) {
                        changed = changed || va !== a;
                        t.push(va);
                    });
                };
                for (var i = 0; i < as.length; i++) {
                    _loop_1(i);
                }
                return errors.length ? new Either_1.Left(errors) : success(changed ? t : as);
            });
        },
        type: type
    };
}
exports.array = array;
function interfaceType(props, name) {
    return {
        _A: exports._A,
        _tag: 'InterfaceType',
        name: name || "{ " + Object.keys(props).map(function (k) { return k + ": " + props[k].name; }).join(', ') + " }",
        validate: function (v, c) {
            return exports.Dictionary.validate(v, c).chain(function (o) {
                var t = __assign({}, o);
                var errors = [];
                var changed = false;
                var _loop_2 = function (k) {
                    var ok = o[k];
                    var type = props[k];
                    var validation = type.validate(ok, c.concat(getContextEntry(k, type)));
                    validation.fold(function (error) { return pushAll(errors, error); }, function (vok) {
                        changed = changed || vok !== ok;
                        t[k] = vok;
                    });
                };
                for (var k in props) {
                    _loop_2(k);
                }
                return errors.length ? new Either_1.Left(errors) : success((changed ? t : o));
            });
        },
        props: props
    };
}
exports.interfaceType = interfaceType;
exports.interface = interfaceType;
function partial(props, name) {
    var partials = {};
    for (var k in props) {
        partials[k] = union([props[k], undefinedType]);
    }
    var type = interfaceType(partials);
    return {
        _A: exports._A,
        _tag: 'PartialType',
        name: name || type.name,
        validate: function (v, c) { return type.validate(v, c); },
        props: partials
    };
}
exports.partial = partial;
function dictionary(domain, codomain, name) {
    return {
        _A: exports._A,
        _tag: 'DictionaryType',
        name: name || "{ [key: " + domain.name + "]: " + codomain.name + " }",
        validate: function (v, c) {
            return exports.Dictionary.validate(v, c).chain(function (o) {
                var t = {};
                var errors = [];
                var changed = false;
                var _loop_3 = function (k) {
                    var ok = o[k];
                    var domainValidation = domain.validate(k, c.concat(getContextEntry(k, domain)));
                    var codomainValidation = codomain.validate(ok, c.concat(getContextEntry(k, codomain)));
                    domainValidation.fold(function (error) { return pushAll(errors, error); }, function (vk) {
                        changed = changed || vk !== k;
                        k = vk;
                    });
                    codomainValidation.fold(function (error) { return pushAll(errors, error); }, function (vok) {
                        changed = changed || vok !== ok;
                        t[k] = vok;
                    });
                };
                for (var k in o) {
                    _loop_3(k);
                }
                return errors.length ? new Either_1.Left(errors) : success((changed ? t : o));
            });
        },
        domain: domain,
        codomain: codomain
    };
}
exports.dictionary = dictionary;
function union(types, name) {
    return {
        _A: exports._A,
        _tag: 'UnionType',
        name: name || "(" + types.map(function (type) { return type.name; }).join(' | ') + ")",
        validate: function (v, c) {
            for (var i = 0; i < types.length; i++) {
                var validation = types[i].validate(v, c);
                if (Either_1.isRight(validation)) {
                    return validation;
                }
            }
            return failure(v, c);
        },
        types: types
    };
}
exports.union = union;
function intersection(types, name) {
    return {
        _A: exports._A,
        _tag: 'IntersectionType',
        name: name || "(" + types.map(function (type) { return type.name; }).join(' & ') + ")",
        validate: function (v, c) {
            var t = v;
            var changed = false;
            var errors = [];
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                var validation = type.validate(t, c);
                validation.fold(function (error) { return pushAll(errors, error); }, function (vv) {
                    changed = changed || vv !== t;
                    t = vv;
                });
            }
            return errors.length ? new Either_1.Left(errors) : success(changed ? t : v);
        },
        types: types
    };
}
exports.intersection = intersection;
function tuple(types, name) {
    return {
        _A: exports._A,
        _tag: 'TupleType',
        name: name || "[" + types.map(function (type) { return type.name; }).join(', ') + "]",
        validate: function (v, c) {
            return arrayType.validate(v, c).chain(function (as) {
                var t = [];
                var errors = [];
                var changed = false;
                var _loop_4 = function (i) {
                    var a = as[i];
                    var type = types[i];
                    var validation = type.validate(a, c.concat(getContextEntry(String(i), type)));
                    validation.fold(function (error) { return pushAll(errors, error); }, function (va) {
                        changed = changed || va !== a;
                        t.push(va);
                    });
                };
                for (var i = 0; i < types.length; i++) {
                    _loop_4(i);
                }
                return errors.length ? new Either_1.Left(errors) : success(changed ? t : as);
            });
        },
        types: types
    };
}
exports.tuple = tuple;
function readonly(type, name) {
    return {
        _A: exports._A,
        _tag: 'ReadonlyType',
        name: name || "Readonly<" + type.name + ">",
        validate: function (v, c) {
            return type.validate(v, c).map(function (x) {
                if (process.env.NODE_ENV !== 'production') {
                    return Object.freeze(x);
                }
                return x;
            });
        },
        type: type
    };
}
exports.readonly = readonly;
function readonlyArray(type, name) {
    var arrayType = array(type);
    return {
        _A: exports._A,
        _tag: 'ReadonlyArrayType',
        name: name || "ReadonlyArray<" + type.name + ">",
        validate: function (v, c) {
            return arrayType.validate(v, c).map(function (x) {
                if (process.env.NODE_ENV !== 'production') {
                    return Object.freeze(x);
                }
                return x;
            });
        },
        type: type
    };
}
exports.readonlyArray = readonlyArray;
//# sourceMappingURL=index.js.map