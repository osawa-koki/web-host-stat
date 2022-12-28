package app

import (
	"github.com/gin-gonic/gin"
)

func Start() {
	r := gin.Default()

	r.StaticFile("/", "./web/index.html")
	r.StaticFile("/index", "./web/index.html")
	r.StaticFile("/about", "./web/about.html")
	r.Static("/_next", "./web/_next")

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run("0.0.0.0:80") // 0.0.0.0:80 でサーバーを立てます。
}
