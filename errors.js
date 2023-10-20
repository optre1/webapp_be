const errBadToken = 'Bad token';
const errRecordNotFound = 'Record not found'
const errBadParams = 'Bad parameters'
const errBadAuth = 'Bad authentication'
const errBadQuery = 'Bad query'
const errBadRequest = 'Bad request'
const errBadResponse = 'Bad response'
const errCouldNotCommunicateWithDatabase = 'Could not communicate with database'
const errCouldNotCommunicateWithServer = 'Could not communicate with server'
const errNoAdminRights = 'No admin rights'
const noErr = 'OK'
const errors = {
    NO_ERR : noErr,
    INVALID_TOKEN : errBadToken,
    RECORD_NOT_FOUND: errRecordNotFound,
    BAD_PARAMS : errBadParams,
    BAD_AUTH: errBadAuth,
    BAD_QUERY: errBadQuery,
    BAD_REQUEST: errBadRequest,
    BAD_RESPONSE: errBadResponse,
    DB_COM_ERR: errCouldNotCommunicateWithDatabase,
    SERVER_COM_ERR: errCouldNotCommunicateWithServer,
    ADMIN_RIGHTS_REQUIRED: errNoAdminRights
};

export default errors;