'use strict';

const reTrue = /^(true|t|yes|y|1)$/i;
const reFalse = /^(false|f|no|n|0)$/i;
const path = require('path');

var generateTemplateString = exports.generateTemplateString = (source) => {
  return new Function('$', 'return `'+source+'`;');
};

const getExtension = exports.getExtension = (filename) => {
  let ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
};

const valueFromObject = exports.valueFromObject = (obj, key, def) => {
  let o = obj;
  let path = key.split('.');
  let segment;
  while(o && path.length){
    segment = path.shift();
    o = o[segment];
  }
  if(typeof(o) !== 'undefined'){
    return o;
  }
  return def;
};

const valueFromObjectCI = exports.valueFromObjectCI = (source, key, defaultValue) => {
  let o = source;
  let path = key.split('.');
  while(o && path.length){
    let segment = path.shift();
    let segmentCamel = toCamel(segment);
    let segmentUnderscore = toUnderscore(segmentCamel);
    o = o[segment]||o[segmentCamel]||o[segmentUnderscore];
  }
  if(typeof(o) !== 'undefined'){
    return o;
  }
  return defaultValue;
};

const setObjectValue = exports.setObjectValue = (source, key, value) => {
  let o = source;
  let path = key.split('.'), last, segment;
  while(o && path.length){
    segment = path.shift();
    last = o;
    o = o[segment];
    if(!o){
      o = last[segment] = {};
    }
  }
  last[segment] = value;
  return source;
};

const setObjectValueCI = exports.setObjectValueCI = (source, key, value) => {
  let o = source;
  let path = key.split('.'), last, segment, segmentCamel, segmentUnderscore;
  while(o && path.length){
    segment = path.shift();
    segmentCamel = toCamel(segment);
    segmentUnderscore = toUnderscore(segmentCamel);
    last = o;
    o = o[segmentCamel]||o[segmentUnderscore];
    if(!o){
      o = last[segment] = {};
    }
  }
  if(last[segment]){
    last[segment] = value;
  }
  if(last[segmentCamel]){
    last[segmentCamel] = value;
  }
  if(last[segmentUnderscore]){
    last[segmentUnderscore] = value;
  }
  return source;
};

const typeOfObject = exports.typeOfObject = (obj) => {
  return (obj.constructor.name||String(obj)).toLowerCase();
};

const replaceStringTokens = exports.replaceStringTokens = (source, regex, values) => {
  return source.replace(regex, (fullMatch, token)=>valueFromObject(values, token));
};

const replaceStringTokensCI = exports.replaceStringTokensCI = (source, regex, values) => {
  return source.replace(regex, (fullMatch, token)=>valueFromObjectCI(values, token));
};

const replaceTokensCI = exports.replaceTokensCI = (source, regex, values) => {
  switch(typeOfObject(source)){
    case('string'):
      return replaceStringTokensCI(source, regex, values);
    case('array'):
      return source.map((item)=>replaceTokensCI(item, regex, values));
    case('object'):
      return Object.keys(source).reduce((obj, key) => {
        obj[key] = replaceTokensCI(source[key], regex, values);
        return obj;
      }, {});
  }
  return source;
};

const replaceTokens = exports.replaceTokens = (source, regex, values) => {
  switch(typeOfObject(source)){
    case('string'):
      return replaceStringTokens(source, regex, values);
    case('array'):
      return source.map((item)=>replaceTokens(item, regex, values));
    case('object'):
      return Object.keys(source).reduce((obj, key) => {
        obj[key] = replaceTokens(source[key], regex, values);
        return obj;
      }, {});
  }
  return source;
};

const toCamel = exports.toCamel = (() => {
  const DEFAULT_REGEX = /[-_]+(.)?/g;

  const toUpper = (match, group1) => {
    return group1 ? group1.toUpperCase() : '';
  }
  return (str, delimiters) => {
    let matchRe = delimiters ? new RegExp(`[${delimiters}]+(.)?`, 'g') : DEFAULT_REGEX;
    if(matchRe.exec(str)){
      return str.toLowerCase().replace(matchRe, toUpper);
    }
    return str;
  };
})();

const toUnderscore = exports.toUnderscore = (() => {
  const DEFAULT_REGEX = /([a-z])([A-Z])/g;

  const toUnderscore = (match, char1, char2)=>char1+'_'+char2;

  return (str, delimiters) => {
    return str.replace(delimiters ? new RegExp(delimiters, 'g') : DEFAULT_REGEX, toUnderscore).toUpperCase();
  };
})();

const isTrue = exports.isTrue = (value) => {
  return !!reTrue.exec(''+value);
};

const isFalse = exports.isFalse = (value) => {
  return !!reFalse.exec(''+value);
};

/* I don't think we will need this
const HashTable = exports.HashTable = function(){
  let instance = this, items = [], indexes = [];
  let getIndex = function(id, defaultIndex){
    defaultIndex = typeof(defaultIndex) === 'undefined' ? -1 : defaultIndex;
    let idx = indexes.indexOf(id);
    return idx===-1?defaultIndex:idx;
  };

  instance.asArray = function(){
    return items;
  };

  instance.slice = function(from, num){
    return items.slice(from, num);
  };

  instance.get = function(id){
    let idx = getIndex(id);
    return idx>-1?items[idx]:false;
  };

  instance.enforce = function(id, record){
    let self = this, l = items.length, idx = getIndex(id, l), result;
    if(idx===l){
      result = items[idx] = typeof(self.initRecord)==='function'?self.initRecord(id, record)||record||{_id: id}:record||{_id: id};
      indexes[idx] = id;
      if(self.initEntry){
        self.initEntry(result);
      }
      return result;
    }
    result = items[idx];
    return result;
  };

  instance.length = function(){
    return items.length;
  };
};
//*/

const lowerFirstLetter = exports.lowerFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const upperFirstLetter = exports.upperFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const isNumeric = exports.isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const defaultMaxInt = exports.defaultMaxInt = (val, def, max) => {
  if(!isNumeric(val)){
    return def;
  }
  if(typeof(val)==='string'){
    val = parseInt(val, 10);
  }
  if(val>max){
    return max;
  }
  return val;
};

/* replaced with replaceTokens
const processTokens = exports.processTokens = function(src, values){
  return JSON.parse(processSimpleTokens(JSON.stringify(src), values));
};

const processSimpleTokens = exports.processSimpleTokens = function(src, values){
  let reTokenExtracter = /\{([^\{]*?)\}/gi;
  let tokenHandler = function(fullToken, symbol){
    let results = fullToken,
        segments = symbol.split('||'),
        parts = segments.shift().split('.'),
        allParts = parts.slice(),
        part, key,
        defaultValue = segments.shift();//||'{'+symbol+'}';
    if(typeof(defaultValue)==='undefined'){
      defaultValue = '';//'{'+symbol+'}';
    }
    key = values;
    while((part = parts.shift()) && key){
      key = key[part];
    }
    results = (typeof(key)==='function')?key(allParts, defaultValue, symbol):key || defaultValue;
    switch(typeof(results)){
      case('string'):
      case('number'):
        break;
      default:
        results = JSON.stringify(results).replace(/\"/gi, '\\"');
    }
    return results;
  };
  return src.replace(reTokenExtracter, tokenHandler);
};
//*/

const isPlainObject = function(obj){
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if ((!obj) || (toString.call(obj) !== '[object Object]') ||
      (obj.nodeType) || (obj.setInterval)){
    return false;
  }

  let has_own_constructor = hasOwnProperty.call(obj, 'constructor');
  let has_is_property_of_method = obj.constructor&&hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
  // Not own constructor property must be Object
  /* istanbul ignore if */
  if (obj.constructor && (!has_own_constructor) && (!has_is_property_of_method)){
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.

  let last_key, key;
  for (key in obj){
    last_key = key;
  }

  return typeof(last_key) === 'undefined' || hasOwnProperty.call(obj, last_key);
};

const extend = function(){
  // copy reference to target object
  let target = arguments[0] || {}, i = 1, length = arguments.length,
      deep = false, options, name, src, copy;

  // Handle a deep copy situation
  /* istanbul ignore if */
  if (typeof(target) === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  /* istanbul ignore if */
  if (typeof(target) !== 'object' && !typeof(target) === 'function'){
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) !== null) {
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        /* istanbul ignore if */
        if (target === copy)
            continue;

        // Recurse if we're merging object literal values or arrays
        if (deep && copy && (isPlainObject(copy) || Array.isArray(copy))) {
          let clone = src && (isPlainObject(src) || Array.isArray(src)) ? src : Array.isArray(copy) ? [] : {};

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof(copy) !== 'undefined'){
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

exports.extend = (...args) => {
  if(!args.length) return {};
  let deep = true;
  if(typeof(args[0]) === 'boolean'){
    deep = args.shift();
  }
  args.unshift(deep, {});
  return extend.apply(null, args);
};

exports.defaults = (...args) => {
  if(!args.length){
    return {};
  }
  args.unshift(true, {});
  return extend.apply(null, args);
};

const getMonday = exports.getMonday = (d) => {
  d = new Date(d);
  let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const getTypedValueFrom = exports.getTypedValueFrom = (value) => {
  if(isNumeric(value)){
    return +value;
  }
  if(isTrue(value)){
    return true;
  }
  if(isFalse(value)){
    return false;
  }
  return value;
};

const exclude = exports.exclude = (source, ...exclude) => {
  let keys = Object.keys(source);
  let res = keys.reduce((obj, key) => {
    if(exclude.indexOf(key)===-1){
      obj[key] = source[key];
    }
    return obj;
  }, {});
  return res;
};

/* Should not be needed by Console, but leaving just in case.
// makeFilter creates a SIFT filter
const makeFilter = exports.makeFilter = function(src){
  let root = {};
  let keys = Object.keys(src||{}), i, l=keys.length, key;
  for(i=0; i<l; i++){
    key = keys[i];
    if(!key.match(/\_id$/)){
      switch(typeof(src[key])){
        case('object'):
          root[key] = makeFilter(src[key]);
          break;
        case('string'):
          // DateTime String: 2013-08-17T00:00:00.000Z
          if(src[key].match(/^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z$/i)){
            root[key] = new Date(src[key]);
            break;
          }

          root[key] = getTypedValueFrom(src[key]);

          switch(src[key].toLowerCase()){
            case("$today"):
              root[key] = new Date();
              root[key].setHours(0, 0, 0, 0);
              break;
            case("$yesterday"):
              root[key] = new Date();
              root[key].setDate(src[key].getDate() - 1);
              root[key].setHours(0, 0, 0, 0);
              break;
            case("$thisweek"):
              root[key] = getMonday(new Date());
              break;
            case("$thismonth"):
              root[key] = new Date();
              root[key].setDate(1);
              root[key].setHours(0, 0, 0, 0);
              break;
            case("$thisyear"):
              root[key] = new Date();
              root[key].setMonth(1);
              root[key].setDate(1);
              root[key].setHours(0, 0, 0, 0);
              break;
          }
        default:
          root[key] = src[key];
      }
    }
  }
  return root;
};
//*/
