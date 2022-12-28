package app

import "github.com/gin-gonic/gin"

type DebugResponse struct {
	Method string `json: "method"`
	Message string `json: "message"`
}

// @description テスト用APIの詳細
// @version 1.0
// @accept application/json
// @Success 200 {object} DebugResponse
// @router /api/debug/ping/ [get]
func debug_get(c *gin.Context) {
	response := DebugResponse{
		Method: "GET",
		Message: "pong",
	}
	c.JSON(200, response)
}

// @description テスト用APIの詳細
// @version 1.0
// @accept application/json
// @Success 200 {object} DebugResponse
// @router /api/debug/ping/ [post]
func debug_post(c *gin.Context) {
	response := DebugResponse{
		Method: "POST",
		Message: "pong",
	}
	c.JSON(200, response)
}

// @description テスト用APIの詳細
// @version 1.0
// @accept application/json
// @Success 200 {object} DebugResponse
// @router /api/debug/ping/ [put]
func debug_put(c *gin.Context) {
	response := DebugResponse{
		Method: "PUT",
		Message: "pong",
	}
	c.JSON(200, response)
}

// @description テスト用APIの詳細
// @version 1.0
// @accept application/json
// @Success 200 {object} DebugResponse
// @router /api/debug/ping/ [delete]
func debug_delete(c *gin.Context) {
	response := DebugResponse{
		Method: "DELETE",
		Message: "pong",
	}
	c.JSON(200, response)
}
