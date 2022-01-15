FROM jjanzic/docker-python3-opencv

WORKDIR /

ADD ./requirements.txt /requirements.txt

RUN pip install -r requirements.txt
RUN pip install -U numpy

ADD . .

EXPOSE 5000

CMD python3 app.py