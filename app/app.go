package app

import (
	"fmt"
	"os"
	//"net/http"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
	_ "example.com/program/docs"
)

var (
	origin = "0.0.0.0:80"
	isProd = true
)

func Start() {

	if (os.Getenv("APP_ENV") == "dev") {
		isProd = false
	}

	fmt.Println("Starting app..." + os.Getenv("APP_ENV"))

	r := gin.Default()

	r.StaticFile("/", "./web/index.html")
	r.StaticFile("/index", "./web/index.html")
	r.StaticFile("/about", "./web/about.html")
	r.Static("/_next", "./web/_next")

	if isProd {
		fmt.Println("Running in production mode")
		gin.SetMode(gin.ReleaseMode)
	} else {
		fmt.Println("Running in development mode")
		url := ginSwagger.URL(fmt.Sprintf("http://%s/swagger/doc.json", origin))
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.Run(origin)
}
