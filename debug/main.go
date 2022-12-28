package main

import (
	"flag"
	"fmt"
	"net"
	"os"
	"time"
)

func main() {
	domain := flag.String("domain", "example.com", "対象となるドメイン")
	flag.Parse()
	fmt.Println(fmt.Sprint("domain: ", *domain))

	success := true

	{
		// 名前解決
		addr, err := net.ResolveIPAddr("ip", *domain)
		if err != nil {
			fmt.Println("Resolve error ", error.Error(err))
			success = false
		}
		fmt.Println("Resovle addr is ", addr.String())
	}

	{
		// LookupHost
		addrs, err := net.LookupHost(*domain)
		if err != nil {
			fmt.Println("Resolution error ", err.Error())
			success = false
		}
		for i, addr := range addrs {
			fmt.Println(fmt.Sprint("LookupHost addr[", i, "] is ", addr))
		}
	}

	{
		// ポートスキャン
		ports := []int{}
		for i := 1; i <= 25; i++ {
			ports = append(ports, i)
		}

		open_ports := []int{}
		closed_ports := []int{}

		for _, port := range ports {
			go (func(port int) {
				target := fmt.Sprint(*domain, ":", port)
				fmt.Printf("Scanning %s.\n", target)
				conn, err := net.Dial("tcp", target)
				if err != nil {
					fmt.Println(fmt.Sprint("Port ", port, " is not open"))
					closed_ports = append(closed_ports, port)
				} else {
					fmt.Println(fmt.Sprint("Port ", port, " is open"))
					open_ports = append(open_ports, port)
					conn.Close()
				}
			})(port)
		}

		time.Sleep(60 * time.Second)
	}

	if success {
		os.Exit(0)
	} else {
		os.Exit(1)
	}
}
