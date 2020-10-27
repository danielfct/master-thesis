FROM golang:1.10

COPY . /go/src/bitbucket.org/cloudedgemicroserviceteam/register-go
WORKDIR /go/src/bitbucket.org/cloudedgemicroserviceteam/register-go

RUN go get -u github.com/FiloSottile/gvt
RUN gvt restore && \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /register bitbucket.org/cloudedgemicroserviceteam/register-go/cmd/register-go