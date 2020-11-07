module.exports = error => {
    return {
        message: error.message,
        locations: error.locations,
        code: error.originalError ? error.originalError.code : undefined,
        path: error.path,
    }
};
