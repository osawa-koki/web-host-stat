package app

import (
	"fmt"
	"os"
	"time"

	//"net/http"

	_ "example.com/program/docs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
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
		// 本番環境
		fmt.Println("Running in production mode")
		gin.SetMode(gin.ReleaseMode)
	} else {
		// 開発環境
		fmt.Println("Running in development mode")
		url := ginSwagger.URL("http://localhost:80/swagger/doc.json")
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))

		// CORSの設定
		r.Use(cors.New(cors.Config{
			// アクセスを許可したいアクセス元
			AllowOrigins: []string {
				"*",
			},
			// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
			AllowMethods: []string{
				"GET",
				"POST",
				"OPTIONS",
			},
			// 許可したいHTTPリクエストヘッダ
			AllowHeaders: []string{
				"Access-Control-Allow-Credentials",
				"Access-Control-Allow-Headers",
				"Content-Type",
				"Content-Length",
				"Accept-Encoding",
				"Authorization",
			},
			AllowCredentials: true,
			MaxAge: 24 * time.Hour,
		}))
	}

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.Run(origin)
}
