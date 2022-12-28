FROM golang:1.19-bullseye

EXPOSE 80
WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
# 実行可能プログラム名をappという名前すると、実行時にディレクトリ名と重複しているため、エラーとなる。
RUN go build -a -x -o main main.go

CMD ["./main"]
