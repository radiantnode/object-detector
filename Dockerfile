ARG BASE="python:3.7-alpine"

FROM $BASE AS builder

ENV PYROOT /usr/src/pyroot
ENV PYTHONUSERBASE $PYROOT

COPY Pipfile* ./

RUN pip install pipenv && \
    PIP_USER=1 PIP_IGNORE_INSTALLED=1 pipenv install --system --deploy --ignore-pipfile

FROM $BASE

ENV PYROOT /usr/src/pyroot
ENV PYTHONUSERBASE $PYROOT

RUN adduser -S app

USER app

WORKDIR /usr/src/app

COPY . .

COPY --from=builder $PYROOT/lib/ $PYROOT/lib/

EXPOSE 5000

CMD [ "bin/server" ]
