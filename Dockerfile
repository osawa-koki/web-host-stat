FROM node:19-bullseye-slim AS WEB_CLIENT
WORKDIR /usr/src/app
COPY ./web_client ./web_client
RUN cd web_client && yarn install && yarn build



FROM golang:1.19-bullseye AS WEB_SERVER

EXPOSE 80
WORKDIR /app

COPY --from=WEB_CLIENT /usr/src/app/web_client/dist ./web

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY go.mod go.sum main.go ./
COPY ./app ./app
COPY ./docs ./docs
# 実行可能プログラム名をappという名前すると、実行時にディレクトリ名と重複しているため、エラーとなる。
RUN go build -a -x -o main main.go

CMD ["./main"]
