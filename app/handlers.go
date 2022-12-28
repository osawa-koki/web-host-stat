package app

import (
	"fmt"
	"net"
	"time"

	"github.com/gin-gonic/gin"
)

type NameResolverRequest struct {
	Domain string `form:"domain"`
}
type NameResolverResponse struct {
	Address string `json:"address"`
	Message string `json:"message"`
	Domain  string `json:"domain"`
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
			Domain:  nameResolver.Domain,
		}
		c.JSON(200, response)
	}
}

// ========== ========== ========== ========== ==========

type LookupHostRequest struct {
	Domain string `form:"domain"`
}
type LookupHostResponse struct {
	Address []string `json:"address"`
	Message string   `json:"message"`
	Domain  string   `json:"domain"`
}

// @description ホスト検索用のAPI
// @version 1.0
// @accept application/json
// @Produce  application/json
// @Param domain query string true "ドメイン名"
// @Success 200 {object} LookupHostResponse
// @Failure 400 {object} LookupHostResponse
// @Failure 500 {object} LookupHostResponse
// @router /api/lookup-host [get]
func lookup_host(c *gin.Context) {
	var lookupResolver LookupHostRequest
	if err := c.ShouldBindQuery(&lookupResolver); err != nil {
		response := LookupHostResponse{
			Message: err.Error(),
		}
		c.JSON(400, response)
		return
	}
	if addrs, err := net.LookupHost(lookupResolver.Domain); err != nil {
		response := LookupHostResponse{
			Message: err.Error(),
		}
		c.JSON(500, response)
	} else {
		response := LookupHostResponse{
			Address: addrs,
			Domain:  lookupResolver.Domain,
		}
		c.JSON(200, response)
	}
}

// ========== ========== ========== ========== ==========

type PortscanRequest struct {
	Host string `form:"host"`
	From int    `form:"from"`
	To   int    `form:"to"`
	Waittime int    `form:"waittime"`
}
type PortscanResponse struct {
	Host    string `json:"host"`
	From    int    `json:"from"`
	To      int    `json:"to"`
	Open    []int  `json:"open"`
	Message string `json:"message"`
}

// @description ポートスキャン用のAPI
// @version 1.0
// @accept application/json
// @Produce  application/json
// @Param host query string true "ホスト名"
// @Param from query int true "開始ポート番号"
// @Param to query int true "終了ポート番号"
// @Param waittime query int true "スキャン時間(秒) | 1-60(default: 5)"
// @Success 200 {object} PortscanResponse
// @Failure 400 {object} PortscanResponse
// @Failure 500 {object} PortscanResponse
// @router /api/port-scan [get]
func port_scan(c *gin.Context) {
	var portscan = PortscanRequest{
		Waittime: 5,
	}
	if err := c.ShouldBindQuery(&portscan); err != nil {
		response := PortscanResponse{
			Message: err.Error(),
		}
		c.JSON(400, response)
		return
	}

	// ポートスキャン
	host := portscan.Host
	from := portscan.From
	to := portscan.To
	ports := []int{}
	waittime := portscan.Waittime

	if from > to {
		response := PortscanResponse{
			Message: "from > to",
		}
		c.JSON(400, response)
		return
	}
	if from < 1 || to > 65535 {
		response := PortscanResponse{
			Message: "from < 1 || to > 65535",
		}
		c.JSON(400, response)
		return
	}
	if to - from > 100 {
		response := PortscanResponse{
			Message: "to - from > 100",
		}
		c.JSON(400, response)
		return
	}
	if waittime < 1 || waittime > 60 {
		response := PortscanResponse{
			Message: "time < 1 || time > 60",
		}
		c.JSON(400, response)
		return
	}

	for i := from; i <= to; i++ {
		ports = append(ports, i)
	}

	open_ports := []int{}

	for _, port := range ports {
		go (func(port int) {
			target := fmt.Sprint(host, ":", port)
			conn, err := net.Dial("tcp", target)
			if err != nil {
				return
			} else {
				open_ports = append(open_ports, port)
				conn.Close()
			}
		})(port)
	}

	time.Sleep(time.Duration(waittime) * time.Second)

	response := PortscanResponse{
		Host: host,
		From: from,
		To:   to,
		Open: open_ports,
	}
	c.JSON(200, response)
}
