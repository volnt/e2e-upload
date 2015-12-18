# Encrypted File Upload with Backblaze

Simple implementation of client side encryption for file upload with backblaze as storage backend.

When uploading a file it will be encrypted client side with the AES algorithm using a randomly generated key. Then it will be uploaded to the server and made available through a unique URL containing the file id and the key.

If you lose the key you will not be able to decrypt the file.

# Install

The project uses MongoDB, Flask and Backblaze.

You will need to get a backblaze account on https://www.backblaze.com/ and get three informations : the account id, the account key and the bucket id.

When this is done you must put them in your environement whith the name specified in the [config file](https://github.com/volnt/e2e-upload/blob/master/project/config.py). You can also put them in a ` .env` file at the repository root level if you want  to launch the server with ` docker-compose`.

## Launch using docker-compose

You can launch the server using `docker-compose up`.

## Launch manually

```
$ virtualenv env
$ source env/bin/active
$ pip install -r requirements.txt
$ python run.py
```

The web server is listenning on the port 5000 by default.
