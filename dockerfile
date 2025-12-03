# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем приложение
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Копируем бинарник
COPY --from=builder /app/main .

# Копируем статику и шаблоны
COPY --from=builder /app/static ./static
COPY --from=builder /app/templates ./templates

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["./main"]