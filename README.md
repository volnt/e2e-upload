# Encrypted File Upload

Simple implementation of client side encryption for file upload.

When uploading a file it will be encrypted client side with the AES algorithm using a randomly generated key. Then it will be uploaded to the server and made available through a unique URL containing the file id and the key.

If you lose the key you will not be able to decrypt the file.

# Install

The project uses MongoDB and Flask.

You can launch the server using `docker-compose up`.
