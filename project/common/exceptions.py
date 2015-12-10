class HttpError(Exception):
    pass


class BadRequest(HttpError):
    code = 400


class Unauthorized(HttpError):
    code = 401


class NotFound(HttpError):
    code = 404


class InternalServerError(HttpError):
    code = 500
