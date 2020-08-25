/* eslint-disable no-restricted-syntax */
const _ = require('lodash');

module.exports = {
  objectHas: (o, prop, delimiter = '.', starAsAnyEle = true) => {
    const pieces = prop.split(delimiter);
    let nowSearch = o;
    let starCnt = 0;
    let ret = true;
    pieces.forEach((piece) => {
      if (piece === '*') {
        starCnt += 1;
      }
    });

    if (starCnt >= 1 && starAsAnyEle) {
      if (starCnt > 1) {
        throw new Error('* can\'t be occur more than once');
      }
      let bucket = null;
      for (const piece of pieces) {
        if (piece === '*') {
          if (_.isArray(nowSearch)) {
            bucket = nowSearch;
          } else {
            ret = false;
            break;
          }
        } else if (bucket === null) {
          if (_.isObject(nowSearch) && _.has(nowSearch, piece)) {
            nowSearch = nowSearch[piece];
          } else {
            ret = false;
            break;
          }
        } else {
          let retFalse = false;
          const bucketTmp = [];
          for (const ele of bucket) {
            if (_.isObject(ele) && _.has(ele, piece)) {
              bucketTmp.push(ele[piece]);
            } else {
              ret = false;
              retFalse = true;
              break;
            }
          }
          if (retFalse) {
            break;
          }
          bucket = bucketTmp;
        }
      }
    } else {
      return _.has(o, prop);
    }

    return ret;
  },

  objectGet: (o, prop, delimiter = '.', starAsAnyEle = true) => {
    const pieces = prop.split(delimiter);
    let nowSearch = o;
    let starCnt = 0;
    let ret = null;
    pieces.forEach((piece) => {
      if (piece === '*') {
        starCnt += 1;
      }
    });

    if (starCnt >= 1 && starAsAnyEle) {
      if (starCnt > 1) {
        throw new Error('* can\'t be occur more than once');
      }

      let bucket = null;
      for (const piece of pieces) {
        if (piece === '*') {
          if (_.isArray(nowSearch)) {
            bucket = nowSearch
          } else {
            throw new Error(`key ${prop} is not an array`);
          }
        } else if (bucket === null) {
          if (_.isObject(nowSearch) && _.has(nowSearch, piece)) {
            nowSearch = nowSearch[piece];
          } else {
            ret = null;
            break;
          }
        } else {
          const bucketTmp = [];
          for (const ele of bucket) {
            if (_.isObject(ele) && _.has(ele, piece)) {
              bucketTmp.push(ele[piece]);
            } else {
              bucketTmp.push(null);
            }
          }
          bucket = bucketTmp;
        }

        ret = bucket === null ? nowSearch : bucket;
      }
    } else {
      ret = _.get(nowSearch, prop);
    }

    return ret;
  },
};
