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
	fmt.Println(fmt.Sprintln("domain: ", *domain))

	addr, err := net.ResolveIPAddr("ip", *domain)
	if err != nil {
		fmt.Println("Resolve error ", error.Error(err))
		os.Exit(1)
	}
	fmt.Println("Resovle addr is ", addr.String())
}
