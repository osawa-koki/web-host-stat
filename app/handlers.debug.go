package app

import "github.com/gin-gonic/gin"

func debug_get(c *gin.Context) {
	c.JSON(200, gin.H{
		"method": "GET",
		"message": "pong",
	})
}

func debug_post(c *gin.Context) {
	c.JSON(200, gin.H{
		"method": "POST",
		"message": "pong",
	})
}

func debug_put(c *gin.Context) {
	c.JSON(200, gin.H{
		"method": "PUT",
		"message": "pong",
	})
}

func debug_delete(c *gin.Context) {
	c.JSON(200, gin.H{
		"method": "DELETE",
		"message": "pong",
	})
}
