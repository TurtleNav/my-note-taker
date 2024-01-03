const crypto = require('crypto');

/*
    Leverage node's crypto library to create a uuid while avoiding any
    additional dependencies for this codebase.

    This function returns 2 random bytes of data converted into a hex string.
    This gives 2^16 (65,536) possible uuids which is large enough for the
    purposes of this project
*/
function getUUID() {
    return crypto.randomBytes(2).toString('hex');
}

module.exports = {getUUID};