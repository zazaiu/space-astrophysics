package api

import (
	"log"
	"space_astrophysics/internal/app/handler"
	"space_astrophysics/internal/app/repository"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func StartServer() {
	log.Println("Starting server")

	repo, err := repository.NewRepository()
	if err != nil {
		logrus.Error("ошибка инициализации репозитория")
		return
	}

	h := handler.NewHandler(repo)

	r := gin.Default()

	r.LoadHTMLGlob("templates/*")
	r.Static("/static", "./static")

	r.GET("/services", h.ListPlanets)
	r.GET("/services/:id", h.ShowPlanetDetail)
	r.GET("/order/:id", h.ViewMission)
	r.GET("/order/add/:id", h.AddPlanet)
	r.GET("/order/calc/:id", h.CalcOrder)
	r.GET("/order/clear/:id", h.ClearPlanet)

	r.Run(":8080")

}
