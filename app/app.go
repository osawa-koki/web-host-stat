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

	router := gin.Default()

	router.StaticFile("/", "./web/index.html")
	router.StaticFile("/index", "./web/index.html")
	router.StaticFile("/about", "./web/about.html")
	router.Static("/_next", "./web/_next")

	if isProd {
		// 本番環境
		fmt.Println("Running in production mode")
		gin.SetMode(gin.ReleaseMode)
	} else {
		// 開発環境
		fmt.Println("Running in development mode")
		gin.SetMode(gin.DebugMode)
		// SetCORS(router)
		url := ginSwagger.URL("http://localhost:80/swagger/doc.json")
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	}

	api := router.Group("/api")
	{

		api.GET("/name-resolver", name_resolver)
		api.GET("/lookup-host", lookup_host)
		api.GET("/port-scan", port_scan)

		debug := api.Group("/debug")
		{
			debug.GET("/ping", debug_get)
			debug.POST("/ping", debug_post)
			debug.PUT("/ping", debug_put)
			debug.DELETE("/ping", debug_delete)
		}
	}

	router.Run(origin)
}

func SetCORS(router *gin.Engine) {
	// CORSの設定
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string {
			"*",
		},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},
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
