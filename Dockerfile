FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y python-dev python-pip

RUN mkdir -p /app/
WORKDIR /app/

ADD requirements.txt /app/
RUN pip install -r requirements.txt

ADD . /app/

EXPOSE 5000

CMD ["python", "run.py"]
