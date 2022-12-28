package app

import (
	"net"

	"github.com/gin-gonic/gin"
)

type NameResolverRequest struct {
	Domain    string `form:"domain"`
}
type NameResolverResponse struct {
	Address string `json:"address"`
	Message string `json:"message"`
	Domain string `json:"domain"`
}

// @description 名前解決用のAPI
// @version 1.0
// @accept application/json
// @Produce  application/json
// @Param domain query string true "ドメイン名"
// @Success 200 {object} NameResolverResponse
// @Failure 400 {object} NameResolverResponse
// @Failure 500 {object} NameResolverResponse
// @router /api/name-resolver [get]
func name_resolver(c *gin.Context) {
	var nameResolver NameResolverRequest
	if err := c.ShouldBindQuery(&nameResolver); err != nil {
		response := NameResolverResponse{
			Message: err.Error(),
		}
		c.JSON(400, response)
		return
	}
	if addr, err := net.ResolveIPAddr("ip", nameResolver.Domain); err != nil {
		response := NameResolverResponse{
			Message: err.Error(),
		}
		c.JSON(500, response)
	} else {
		response := NameResolverResponse{
			Address: addr.String(),
			Domain: nameResolver.Domain,
		}
		c.JSON(200, response)
	}
}
