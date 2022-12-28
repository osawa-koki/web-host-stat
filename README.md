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
go run main.go
```

Dockerを使用するなら、、、  

```shell
docker build -t web-host-stat .
docker run -p 8080:80 -it --rm --name my-web-host-stat web-host-stat
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
