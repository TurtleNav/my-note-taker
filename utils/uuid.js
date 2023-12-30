crypto = require('crypto');

/*
    Leverage node's crypto library to create a uuid while avoiding any
    additional dependencies in this codebase.

    This function returns 4 random bytes of data converted into a hex string.
    This gives 2^32 - 1 (4,294,967,295) possible uuids which is large enough
    for the purposes of this project
*/
function getUUID() {
    return crypto.randomBytes(4).toString('hex');
}

module.exports = {getUUID};