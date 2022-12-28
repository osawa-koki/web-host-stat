# web-host-stat

Webホスト(Webサーバ)のイロイロをチェックするサイトが欲しくて、、、  
以下の機能が欲しい。  

- 名前解決(DNSチェック)
- ポートスキャン

## 技術的な

GoとNext.jsで実現したい。  

## 実行方法

```shell
# デバグ実行
$Env:APP_ENV="dev" && swag init && go run main.go
```

Dockerを使用するなら、、、  

```shell
docker build -t web-host-stat .
docker run -p 80:80 -it --rm --name my-web-host-stat web-host-stat

# 一行で書くと、、、
docker build -t web-host-stat . && docker run -p 80:80 -it --rm --name my-web-host-stat web-host-stat
```

Dockerでの開発用(サーバのみ)実行は、、、

```shell
docker build -t web-host-stat-dev -f Dockerfile.dev .
docker run -p 80:80 -it --rm --name my-web-host-stat-dev web-host-stat-dev

# 一行でビルド&実行を行う
docker build -t web-host-stat-dev -f Dockerfile.dev . && docker run -p 80:80 -it --rm --name my-web-host-stat-dev web-host-stat-dev
```

## デプロイ設定

| キー | バリュー |
| ---- | ---- |
| Name | web-host-stat |
| Region | Oregon(US West) |
| Branch | main |
| Root Directory |  |
| Environment | Docker |
| Dockerfile Path | ./Dockerfile |
| Docker Build Context Directory |  |
| Docker Command |  |
