package handler

import (
	"encoding/json"
	"math"
	"net/http"
	"space_astrophysics/internal/app/models"
	"space_astrophysics/internal/app/repository"
	"space_astrophysics/internal/utils"
	"strconv"
	"strings"
	"time"

	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Handler struct {
	Repo *repository.Repository
}

func NewHandler(r *repository.Repository) *Handler {
	return &Handler{Repo: r}
}

//=====================
//Сессии
//==========

// =========================================================
// 🔐 JWT + роли
// =========================================================

var jwtKey = []byte("super_secret_key")

type Claims struct {
	UserID int    `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// =========================================================
// 👤 USERS (регистрация / вход / профиль)
// =========================================================
//
//	@Summary		Регистрация пользователя
//	@Description	Создаёт нового пользователя
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			user	body		models.User	true	"Пользователь"
//	@Success		201		{object}	models.User
//	@Failure		400		{object}	map[string]string
//	@Failure		500		{object}	map[string]string
//	@Router			/api/users/register [post]
func (h *Handler) RegisterUser(ctx *gin.Context) {
	var u models.User
	if err := ctx.ShouldBindJSON(&u); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if u.Role == "" {
		u.Role = "astronaut"
	}
	if err := h.Repo.CreateUser(&u); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, u)
}

// @Summary		Профиль пользователя
// @Description	Получение данных профиля авторизованного пользователя
// @Tags			users
// @Produce		json
// @Success		200	{object}	models.User
// @Failure		404	{object}	map[string]string
// @Router			/api/users/profile [get]
// @Security		ApiKeyAuth
func (h *Handler) GetUserProfile(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	user, err := h.Repo.GetUserByID(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}
	ctx.JSON(http.StatusOK, user)
}

// =========================================================
// 🪐 PLANETS (услуги)
// =========================================================
//
//	@Summary		Список планет
//	@Description	Получение всех планет, опционально фильтруя по названию
//	@Tags			planets
//	@Produce		json
//	@Param			q	query		string	false	"Поиск по имени"
//	@Success		200	{array}		models.Planet
//	@Failure		500	{object}	map[string]string
//	@Router			/api/planets [get]
func (h *Handler) ListPlanets(ctx *gin.Context) {
	q := ctx.Query("q")
	planets, err := h.Repo.GetAllPlanets()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var filtered []models.Planet
	for _, p := range planets {
		if q == "" || strings.Contains(strings.ToLower(p.Name), strings.ToLower(q)) {
			filtered = append(filtered, p)
		}
	}
	ctx.JSON(http.StatusOK, filtered)
}

// @Summary		Детали планеты
// @Description	Получение данных конкретной планеты по ID
// @Tags			planets
// @Produce		json
// @Param			id	path		int	true	"ID планеты"
// @Success		200	{object}	models.Planet
// @Failure		404	{object}	map[string]string
// @Router			/api/planets/{id} [get]
func (h *Handler) ShowPlanetDetail(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	planet, err := h.Repo.GetPlanetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Планета не найдена"})
		return
	}
	ctx.JSON(http.StatusOK, planet)
}

// @Summary		Создание планеты
// @Description	Создаёт новую планету (только модератор)
// @Tags			planets
// @Accept			json
// @Produce		json
// @Param			planet	body		models.Planet	true	"Новая планета"
// @Success		201		{object}	models.Planet
// @Failure		400		{object}	map[string]string
// @Failure		500		{object}	map[string]string
// @Router			/api/planets [post]
// @Security		ApiKeyAuth
func (h *Handler) CreatePlanet(ctx *gin.Context) {
	var p models.Planet
	if err := ctx.ShouldBindJSON(&p); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат"})
		return
	}
	p.Status = "active"
	if err := h.Repo.CreatePlanet(&p); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, p)
}

// @Summary		Обновление планета
// @Description	Обновляет данные планеты по ID (только модератор)
// @Tags			planets
// @Accept			json
// @Produce		json
// @Param			id		path		int				true	"ID планеты"
// @Param			planet	body		models.Planet	true	"Данные для обновления"
// @Success		200		{object}	map[string]string
// @Failure		400		{object}	map[string]string
// @Failure		500		{object}	map[string]string
// @Router			/api/planets/{id} [put]
// @Security		ApiKeyAuth
func (h *Handler) UpdatePlanet(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var update models.Planet
	if err := ctx.ShouldBindJSON(&update); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.Repo.UpdatePlanet(id, update); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Планета обновлена"})
}

// @Summary		Удаление планеты
// @Description	Удаляет планету по ID (только модератор)
// @Tags			planets
// @Produce		json
// @Param			id	path		int	true	"ID планеты"
// @Success		200	{object}	map[string]string
// @Failure		500	{object}	map[string]string
// @Router			/api/planets/{id} [delete]
// @Security		ApiKeyAuth
func (h *Handler) DeletePlanet(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := h.Repo.DeletePlanet(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Планета удалена"})
}

// =========================================================
// 🌍 WORLDS (заявки)
// =========================================================

// GET /api/worlds/:id - Просмотр заявки
func (h *Handler) ViewWorld(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	world, err := h.Repo.GetWorldByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Проверка прав доступа
	userID := ctx.GetInt("user_id")
	role := ctx.GetString("role")

	// Модератор видит все, пользователь - только свои заявки
	if role != "mission_control" && world.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав"})
		return
	}

	ctx.JSON(http.StatusOK, world)
}

// PUT /api/worlds/:id - Обновление заявки
func (h *Handler) UpdateWorld(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))

	// Проверяем, существует ли заявка
	world, err := h.Repo.GetWorldByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Проверка прав доступа
	userID := ctx.GetInt("user_id")
	role := ctx.GetString("role")

	if role != "mission_control" && world.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав"})
		return
	}

	// Проверяем, можно ли редактировать (только черновики)
	if world.WorldStatus != "draft" && role != "mission_control" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Только черновики можно редактировать"})
		return
	}

	var update map[string]interface{}
	if err := ctx.ShouldBindJSON(&update); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Запрещаем обновление некоторых полей
	delete(update, "id")
	delete(update, "creator_id")
	delete(update, "created_at")

	// Пользователи не могут менять статус, кроме модераторов
	if role != "mission_control" {
		delete(update, "world_status")
		delete(update, "total_distance")
		delete(update, "average_angle")
		delete(update, "completed_at")
	}

	if err := h.Repo.UpdateWorldFields(id, update); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Заявка обновлена"})
}

// PUT /api/worlds/:id/form - Оформление заявки
func (h *Handler) FormWorld(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))

	// Проверяем, существует ли заявка
	world, err := h.Repo.GetWorldByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Проверка прав доступа
	userID := ctx.GetInt("user_id")
	if world.CreatorID != userID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав"})
		return
	}

	// Проверяем, можно ли оформить (только черновики)
	if world.WorldStatus != "draft" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Можно оформлять только черновики"})
		return
	}

	// Проверяем, есть ли планеты в заявке
	if len(world.Planets) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Добавьте планеты в заявку"})
		return
	}

	if err := h.Repo.FormWorld(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Заявка оформлена"})
}

// ListWorldsFiltered - получение списка заявок с фильтрами
func (h *Handler) ListWorldsFiltered(ctx *gin.Context) {
	role := ctx.GetString("role")
	userID := ctx.GetInt("user_id")

	status := ctx.Query("status")
	from := ctx.Query("from")
	to := ctx.Query("to")

	var worlds []models.World
	var err error

	if role == "mission_control" {
		worlds, err = h.Repo.GetWorldsFiltered(status, from, to)
	} else {
		worlds, err = h.Repo.GetWorldsByCreator(userID)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, worlds)
}

// DeleteWorld - удаление заявки
func (h *Handler) DeleteWorld(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))

	// Проверяем, существует ли заявка
	world, err := h.Repo.GetWorldByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Проверяем права (только создатель или модератор может удалить)
	userID := ctx.GetInt("user_id")
	role := ctx.GetString("role")

	if world.CreatorID != userID && role != "mission_control" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав для удаления"})
		return
	}

	if err := h.Repo.DeleteWorldSQL(id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Заявка удалена"})
}

// CreateWorld - создание новой заявки
func (h *Handler) CreateWorld(ctx *gin.Context) {
	var input struct {
		Theme       string `json:"theme"`
		Description string `json:"description"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный JSON: " + err.Error()})
		return
	}

	userID := ctx.GetInt("user_id")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Не авторизован"})
		return
	}

	// Создаем новую заявку
	world := models.World{
		CreatorID:   userID,
		Theme:       input.Theme,
		Description: input.Description,
		WorldStatus: "draft",
		CreatedAt:   time.Now(),
	}

	if err := h.Repo.CreateWorld(&world); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка создания заявки: " + err.Error()})
		return
	}

	// Получаем созданную заявку
	createdWorld, err := h.Repo.GetWorldByID(world.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка получения созданной заявки"})
		return
	}

	ctx.JSON(http.StatusCreated, createdWorld)
}

// CompleteWorld - завершение заявки
func (h *Handler) CompleteWorld(ctx *gin.Context) {
	role := ctx.GetString("role")
	if role != "mission_control" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Доступ запрещён"})
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))

	// Получаем заявку для расчета
	world, err := h.Repo.GetWorldByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Рассчитываем суммарное расстояние и средний угол из данных WorldPlanet
	totalDistance := 0.0
	totalAngle := 0.0
	planetCount := len(world.Planets)

	for _, wp := range world.Planets {
		// Используем поля Distance и Angle из WorldPlanet
		totalDistance += wp.Distance
		totalAngle += wp.Angle
	}

	averageAngle := 0.0
	if planetCount > 0 {
		averageAngle = totalAngle / float64(planetCount)
	}

	// Вызываем репозиторий с обновленными параметрами
	if err := h.Repo.CompleteWorld(id, totalDistance, averageAngle); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":        "Заявка завершена",
		"total_distance": totalDistance,
		"average_angle":  averageAngle,
		"planet_count":   planetCount,
	})
}

// =========================================================
// ⚙️ M-M связи (WorldPlanet)
// =========================================================

// PUT /api/worlds/:world_id/planet/:planet_id
func (h *Handler) UpdateWorldPlanet(ctx *gin.Context) {
	worldID, _ := strconv.Atoi(ctx.Param("world_id"))
	planetID, _ := strconv.Atoi(ctx.Param("planet_id"))
	var payload struct {
		Angle    float64 `json:"angle"`
		Distance float64 `json:"distance"`
		Comment  string  `json:"comment"`
	}
	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный JSON"})
		return
	}
	if err := h.Repo.UpdateWorldPlanetFields(worldID, planetID, payload.Angle, payload.Distance, payload.Comment); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Связь обновлена"})
}

// DELETE /api/worlds/:world_id/planet/:planet_id
func (h *Handler) DeleteWorldPlanet(ctx *gin.Context) {
	worldID, _ := strconv.Atoi(ctx.Param("world_id"))
	planetID, _ := strconv.Atoi(ctx.Param("planet_id"))
	if err := h.Repo.DeleteWorldPlanet(worldID, planetID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Планета удалена из заявки"})
}

// @Summary		Обновление профиля
// @Description	Обновляет данные авторизованного пользователя
// @Tags			users
// @Accept			json
// @Produce		json
// @Param			user	body		models.User	true	"Обновлённые данные"
// @Success		200		{object}	map[string]string
// @Failure		400		{object}	map[string]string
// @Failure		500		{object}	map[string]string
// @Router			/api/users/profile [put]
// @Security		ApiKeyAuth
func (h *Handler) UpdateUserProfile(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	var update models.User
	if err := ctx.ShouldBindJSON(&update); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный JSON"})
		return
	}
	if err := h.Repo.UpdateUser(userID, update); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Профиль обновлён"})
}

// @Summary		Вход пользователя
// @Description	Аутентификация и выдача JWT
// @Tags			users
// @Accept			json
// @Produce		json
// @Param			credentials	body		map[string]string	true	"Логин и пароль"
// @Success		200			{object}	map[string]string
// @Failure		400			{object}	map[string]string
// @Failure		401			{object}	map[string]string
// @Failure		500			{object}	map[string]string
// @Router			/api/users/login [post]
func (h *Handler) Login(ctx *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.Repo.Authenticate(req.Username, req.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Неверные данные"})
		return
	}

	tokenString, err := utils.GenerateJWT(user.ID, user.Role)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании токена"})
		return
	}

	if err := utils.SetSession(tokenString, user.ID, user.Role, 2*time.Hour); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при сохранении сессии"})
		return
	}

	// Устанавливаем куку для браузера (Swagger)
	ctx.SetCookie("session_id", tokenString, 7200, "/", "localhost", false, true)

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Успешный вход",
		"token":   tokenString,
		"role":    user.Role,
		"user_id": user.ID,
	})
}

// @Summary		Выход пользователя
// @Description	Удаляет сессию из Redis
// @Tags			users
// @Produce		json
// @Success		200	{object}	map[string]string
// @Failure		400	{object}	map[string]string
// @Router			/api/users/logout [post]
// @Security		ApiKeyAuth
func (h *Handler) Logout(ctx *gin.Context) {
	token := ctx.GetHeader("Authorization")
	if token == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Требуется токен"})
		return
	}
	token = strings.TrimPrefix(token, "Bearer ")
	_ = utils.DeleteSession(token)
	ctx.JSON(http.StatusOK, gin.H{"message": "Вы вышли"})
}

// =========================================================
// 🛒 КОРЗИНА / WORLDS
// =========================================================

func (h *Handler) GetCartIcon(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	count, err := h.Repo.GetUserCartCount(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"cart_count": count})
}

// @Summary        Добавление планеты в заявку
// @Description    Добавляет планету в заявку (черновую или существующую)
// @Tags           Worlds
// @Accept         json
// @Produce        json
// @Param          id          path    int                                                     true    "ID заявки"
// @Param          planet_id   path    int                                                     true    "ID планеты"
// @Param          body        body    struct{Angle float64; Distance float64; Comment string} true    "Данные планеты"
// @Success        200         {object} map[string]interface{}                                 "Планета добавлена в заявку"
// @Failure        400         {object} map[string]string                                      "Некорректные данные"
// @Failure        401         {object} map[string]string                                      "Не авторизован"
// @Failure        403         {object} map[string]string                                      "Недостаточно прав"
// @Security       BearerAuth
// @Router         /api/worlds/{id}/planet/{planet_id} [post]
func (h *Handler) AddPlanetToWorld(ctx *gin.Context) {
	// Получаем ID заявки и планеты из параметров пути
	worldID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID заявки"})
		return
	}

	planetID, err := strconv.Atoi(ctx.Param("planet_id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Неверный ID планеты"})
		return
	}

	userID := ctx.GetInt("user_id")
	role := ctx.GetString("role")

	var req struct {
		Angle    float64 `json:"angle"`
		Distance float64 `json:"distance"`
		Comment  string  `json:"comment"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный JSON: " + err.Error()})
		return
	}

	// Проверяем, существует ли заявка и принадлежит ли пользователю
	world, err := h.Repo.GetWorldByID(worldID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Проверяем права доступа
	if world.CreatorID != userID && role != "mission_control" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав"})
		return
	}

	// Проверяем статус заявки - можно добавлять только в черновики
	if world.WorldStatus != "draft" && role != "mission_control" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Планеты можно добавлять только в черновики"})
		return
	}

	// Проверяем, существует ли планета
	planet, err := h.Repo.GetPlanetByID(planetID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Планета не найдена"})
		return
	}

	// Добавляем планету в заявку
	if err := h.Repo.AddPlanetToWorld(worldID, planetID, req.Angle, req.Distance, req.Comment); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":     "Планета добавлена в заявку",
		"world_id":    worldID,
		"planet_id":   planetID,
		"planet_name": planet.Name,
	})
}

// =========================================================
// 🖼️ PLANET IMAGE
// =========================================================

func (h *Handler) UploadPlanetImage(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	file, err := ctx.FormFile("image")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Файл не загружен"})
		return
	}
	path := "static/uploads/" + file.Filename
	if err := ctx.SaveUploadedFile(file, path); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := h.Repo.UpdatePlanetImage(id, "/"+path); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Изображение обновлено", "path": "/" + path})
}

// =========================================================
// 🔗 M-M GET /world-planets/:world_id/:planet_id
// =========================================================
// @Summary        Получить связь мир-планета
// @Description    Получает данные связи между миром и планетой
// @Tags           admin
// @Produce        json
// @Param          world_id    path    int    true    "ID мира"
// @Param          planet_id   path    int    true    "ID планеты"
// @Success        200         {object} models.WorldPlanet
// @Failure        404         {object} map[string]string
// @Router         /api/world-planets/{world_id}/{planet_id} [get]
// @Security       BearerAuth
func (h *Handler) GetWorldPlanet(ctx *gin.Context) {
	worldID, _ := strconv.Atoi(ctx.Param("world_id"))
	planetID, _ := strconv.Atoi(ctx.Param("planet_id"))
	wp, err := h.Repo.GetWorldPlanet(worldID, planetID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Связь не найдена"})
		return
	}
	ctx.JSON(http.StatusOK, wp)
}

// =========================================================
// 🚀 Утилиты расчёта орбит (расчет положения планет)
// =========================================================

// calculatePlanetPosition рассчитывает расстояние от Солнца и угол для планеты на указанную дату
func calculatePlanetPosition(planet models.Planet, date time.Time) (distance, angle float64) {
	// Для простоты используем симуляцию орбитальных параметров
	// В реальном приложении здесь будут сложные астрономические расчеты

	// Базовые расстояния планет от Солнца в астрономических единицах (AU)
	baseDistances := map[string]float64{
		"Меркурий": 0.39,
		"Венера":   0.72,
		"Земля":    1.0,
		"Марс":     1.52,
		"Юпитер":   5.20,
		"Сатурн":   9.58,
		"Уран":     19.22,
		"Нептун":   30.05,
	}

	// Базовый угол (от 0 до 360 градусов)
	baseAngle := 45.0 // упрощенный угол

	// Получаем базовое расстояние для планеты
	baseDistance, ok := baseDistances[planet.Name]
	if !ok {
		baseDistance = 1.0 // по умолчанию
	}

	// Добавляем вариацию в зависимости от даты для симуляции движения
	daysSinceEpoch := float64(date.Unix() / (24 * 3600))

	// Простая симуляция: расстояние немного меняется со временем
	distance = baseDistance + 0.1*math.Sin(daysSinceEpoch/365.25*2*math.Pi)

	// Угол зависит от времени (симуляция орбитального движения)
	angle = math.Mod(baseAngle+daysSinceEpoch*0.9856, 360) // ~1 градус в день

	return distance, angle
}

// =========================================================
// 🧠 ADMIN / REDIS
// =========================================================

// GetSessionsViaLua получает все ключи сессий из Redis через Lua
func GetSessionsViaLua() ([]map[string]string, error) {
	ctx := context.Background()

	// Lua-скрипт: ищет все ключи, где есть HSET (данные сессии)
	script := `
		local keys = redis.call("keys", "session:*")
		local result = {}
		for i, key in ipairs(keys) do
			local data = redis.call("hgetall", key)
			if #data > 0 then
				local entry = { key = key }
				for j = 1, #data, 2 do
					entry[data[j]] = data[j + 1]
				end
				table.insert(result, entry)
			end
		end
		return cjson.encode(result)
	`

	val, err := utils.RedisClient.Eval(ctx, script, []string{}).Result()
	if err != nil {
		return nil, fmt.Errorf("ошибка при выполнении Lua: %v", err)
	}

	decoded, ok := val.(string)
	if !ok {
		return nil, fmt.Errorf("не удалось декодировать Lua результат")
	}

	var sessions []map[string]string
	if err := json.Unmarshal([]byte(decoded), &sessions); err != nil {
		return nil, fmt.Errorf("ошибка при JSON-декодировании: %v", err)
	}

	return sessions, nil
}

// ListSessions показывает активные сессии пользователей через Redis Lua
func (h *Handler) ListSessions(ctx *gin.Context) {
	sessions, err := GetSessionsViaLua()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"sessions": sessions})
}

// ShowAllSessions показывает все активные сессии (только для модераторов)
func (h *Handler) ShowAllSessions(ctx *gin.Context) {
	// Проверяем права - только для модераторов
	role := ctx.GetString("role")
	if role != "mission_control" {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав"})
		return
	}

	sessions, err := utils.GetAllSessionsDetailed()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"total_sessions": len(sessions),
		"sessions":       sessions,
	})
}

// AuthMiddleware проверяет авторизацию через куки ИЛИ заголовок Authorization
func (h *Handler) AuthMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var tokenString string

		// ПРИОРИТЕТ 1: Проверяем куки (для Swagger)
		if cookie, err := ctx.Cookie("session_id"); err == nil && cookie != "" {
			tokenString = cookie
		}

		// ПРИОРИТЕТ 2: Проверяем заголовок Authorization (для Postman)
		if tokenString == "" {
			tokenStr := ctx.GetHeader("Authorization")
			if tokenStr != "" {
				tokenString = strings.TrimPrefix(tokenStr, "Bearer ")
			}
		}

		if tokenString == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Требуется авторизация"})
			ctx.Abort()
			return
		}

		// Проверяем JWT токен
		claims := &utils.Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return utils.JWTKey, nil
		})

		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный токен"})
			ctx.Abort()
			return
		}

		// Проверяем существование сессии в Redis
		userID, role, err := utils.GetSession(tokenString)
		if err != nil || userID == 0 {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Сессия не найдена"})
			ctx.Abort()
			return
		}

		// Проверка роли
		if len(allowedRoles) > 0 {
			allowed := false
			for _, allowedRole := range allowedRoles {
				if role == allowedRole {
					allowed = true
					break
				}
			}
			if !allowed {
				ctx.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав"})
				ctx.Abort()
				return
			}
		}

		ctx.Set("user_id", userID)
		ctx.Set("role", role)
		ctx.Next()
	}
}

// @Summary		Проверка Redis (Lua)
// @Description	Возвращает сырые данные из Redis через Lua для демонстрации
// @Tags			admin
// @Produce		json
// @Success		200	{object}	map[string]interface{}
// @Router			/api/admin/redis-check [get]
func (h *Handler) RedisCheck(ctx *gin.Context) {
	sessions, err := utils.GetAllSessionsLua()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "Данные из Redis через Lua:",
		"sessions": sessions,
		"total":    len(sessions),
	})
}

// =========================================================
// 🛒 CART (корзина - всегда доступна)
// =========================================================

// @Summary		Получить корзину
// @Description	Возвращает данные корзины. Для неавторизованных: count=0, user_id=-1. Для авторизованных: реальные данные.
// @Tags			cart
// @Produce		json
// @Success		200	{object}	map[string]interface{}	"Данные корзины"
// @Router			/api/cart [get]
func (h *Handler) GetCart(ctx *gin.Context) {
	response := map[string]interface{}{
		"count":   0,
		"user_id": -1,
	}

	// Пытаемся получить user_id из контекста (если пользователь авторизован)
	if userID, exists := ctx.Get("user_id"); exists {
		if userIDInt, ok := userID.(int); ok && userIDInt > 0 {
			// Пользователь авторизован - получаем реальные данные
			count, err := h.Repo.GetUserCartCount(userIDInt)
			if err == nil {
				response["count"] = count
				response["user_id"] = userIDInt

				// Если есть world_id, тоже добавляем
				if world, err := h.Repo.GetOrCreateDraftWorld(userIDInt); err == nil {
					response["world_id"] = world.ID
				}
			}
		}
	}

	ctx.JSON(http.StatusOK, response)
}

// GetOrCreateDraftWorld - получаем или создаем черновик (для внутреннего использования)
func (h *Handler) GetOrCreateDraftWorld(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	if userID == 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Не авторизован"})
		return
	}

	world, err := h.Repo.GetOrCreateDraftWorld(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, world)
}

// CalculatePlanetPosition - расчет позиции планеты
func CalculatePlanetPosition(planetName string, calculationDate time.Time) (distance, angle float64) {
	// Базовые расстояния планет от Солнца в астрономических единицах (AU)
	baseDistances := map[string]float64{
		"Меркурий": 0.39,
		"Венера":   0.72,
		"Земля":    1.0,
		"Марс":     1.52,
		"Юпитер":   5.20,
		"Сатурн":   9.58,
		"Уран":     19.22,
		"Нептун":   30.05,
	}

	// Базовый угол (от 0 до 360 градусов)
	baseAngle := 45.0

	// Получаем базовое расстояние для планеты
	baseDistance, ok := baseDistances[planetName]
	if !ok {
		baseDistance = 1.0 // по умолчанию
	}

	// Добавляем вариацию в зависимости от даты для симуляции движения
	daysSinceEpoch := float64(calculationDate.Unix() / (24 * 3600))

	// Простая симуляция: расстояние немного меняется со временем
	distance = baseDistance + 0.1*math.Sin(daysSinceEpoch/365.25*2*math.Pi)

	// Угол зависит от времени (симуляция орбитального движения)
	angle = math.Mod(baseAngle+daysSinceEpoch*0.9856, 360) // ~1 градус в день

	return distance, angle
}

// CalculateOrbitalData - расчет орбитальных данных для планет в заявке
// @Summary        Расчет орбитальных данных
// @Description    Рассчитывает расстояние и угол для всех планет в заявке на указанную дату
// @Tags           Worlds
// @Accept         json
// @Produce        json
// @Param          id      path    int     true    "ID заявки"
// @Param          date    query   string  true    "Дата расчета в формате YYYY-MM-DD"
// @Success        200     {object}    map[string]interface{}
// @Router         /api/worlds/{id}/calculate [post]
// @Security       BearerAuth
func (h *Handler) CalculateOrbitalData(ctx *gin.Context) {
	worldID, _ := strconv.Atoi(ctx.Param("id"))
	dateStr := ctx.Query("date")

	// Парсим дату
	calculationDate := time.Now()
	if dateStr != "" {
		if parsedDate, err := time.Parse("2006-01-02", dateStr); err == nil {
			calculationDate = parsedDate
		}
	}

	// Получаем заявку
	world, err := h.Repo.GetWorldByID(worldID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Заявка не найдена"})
		return
	}

	// Рассчитываем данные для каждой планеты
	results := []map[string]interface{}{}
	totalDistance := 0.0
	totalAngle := 0.0

	for _, wp := range world.Planets {
		// Используем данные из планеты
		distance, angle := CalculatePlanetPosition(wp.Planet.Name, calculationDate)

		// Обновляем данные в WorldPlanet (M-M связи)
		if err := h.Repo.UpdateWorldPlanetFields(worldID, wp.PlanetID, angle, distance, "Рассчитано автоматически"); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		results = append(results, map[string]interface{}{
			"planet_id":        wp.PlanetID,
			"planet_name":      wp.Planet.Name,
			"distance_au":      distance,
			"angle_degrees":    angle,
			"calculation_date": calculationDate.Format("2006-01-02"),
		})

		totalDistance += distance
		totalAngle += angle
	}

	averageAngle := 0.0
	if len(results) > 0 {
		averageAngle = totalAngle / float64(len(results))
	}

	// Обновляем общие данные заявки
	if err := h.Repo.UpdateWorldFields(worldID, map[string]interface{}{
		"total_cost": totalDistance, // Используем total_cost для хранения общего расстояния
	}); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":          "Орбитальные данные рассчитаны",
		"calculation_date": calculationDate.Format("2006-01-02"),
		"total_distance":   totalDistance,
		"average_angle":    averageAngle,
		"planets":          results,
	})
}
