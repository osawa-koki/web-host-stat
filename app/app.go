package app

import "github.com/gin-gonic/gin"

func Start() {
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello go gin 👍",
		})
	})
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.Run("0.0.0.0:80") // 0.0.0.0:8080 でサーバーを立てます。
}
