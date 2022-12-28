package main

import (
	"flag"
	"fmt"
	"net"
	"os"
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

	if success {
		os.Exit(0)
	} else {
		os.Exit(1)
	}
}
