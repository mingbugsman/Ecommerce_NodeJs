'use strict'

const _ = require('lodash');


const getInfoData = ({fields = [], object = {} }) => {
    return _.pick(object,fields);
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach( k => {
        if (obj[k] == null) {
            delete obj[k];
        }
    })
    return obj;
}

const updateNestedObjectParser = obj => {
    const final = {};
    Object.keys(obj).forEach( k => {
        if (typeof obj[k] === 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach( el => {
                final[`${k}.${el}`] = res[el];
            })
        }
        else {
            final[k] = obj[k]
        }
    })
    return final
}
module.exports = {
    getInfoData,
    removeUndefinedObject,
    updateNestedObjectParser
}