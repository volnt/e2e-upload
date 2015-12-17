import base64
import requests
import hashlib


def b2_authorize_account(account_id, account_key):
    """
    Used to log in to the B2 API.

    Args:
        account_id: the account id
        account_key: the account key

    Returns:
        a json containing accountId, authorizationToken, apiUrl and downloadUrl

    Documentation:
        https://www.backblaze.com/b2/docs/b2_authorize_account.html
    """
    auth_url = "https://api.backblaze.com/b2api/v1/b2_authorize_account"
    id_and_key = base64.b64encode(u"{}:{}".format(account_id, account_key))
    auth_string = u"Basic {}".format(id_and_key)

    headers = {
        "Authorization": auth_string
    }

    resp = requests.get(auth_url, headers=headers)

    return resp.json()


def b2_get_upload_url(bucket_id, api_url, authorization_token):
    """
    When you upload a file to B2, you must call b2_get_upload_url first to get
    the URL for uploading directly to the place where the file will be stored.

    Args:
        bucket_id: the bucket id
        api_url: the root api url
        authorization_token: the token used to authorize connections

    Returns:
        a json containing bucketId, uploadUrl and authorizationToken

    Documentation:
        https://www.backblaze.com/b2/docs/b2_get_upload_url.html
    """
    request_url = u"{}/b2api/v1/b2_get_upload_url".format(api_url)
    headers = {
        "Authorization": authorization_token,
    }
    body = {
        "bucketId": bucket_id,
    }

    resp = requests.post(request_url, json=body, headers=headers)

    return resp.json()


def b2_upload_file(file_to_upload, upload_url, authorization_token):
    """
    Uploads one file to B2, returning its unique file ID.

    Args:
        file_to_upload: the file to upload
        upload_url: the upload url from b2_get_upload_url
        authorization_token: the token used to authorize connections

    Returns:
        a json containing fileId, fileName, accountId, bucketId, contentLength
        contentSha1, contentType and fileInfo

    Documentation:
        https://www.backblaze.com/b2/docs/b2_upload_file.html
    """
    file_data = file_to_upload.read()

    headers = {
        "Authorization": authorization_token,
        "X-Bz-File-Name": file_to_upload.filename,
        "Content-Type": file_to_upload.content_type,
        "X-Bz-Content-Sha1": hashlib.sha1(file_data).hexdigest(),
    }

    resp = requests.post(upload_url, data=file_data, headers=headers)

    return resp.json()
