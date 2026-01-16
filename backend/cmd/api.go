package main

import (
	repo "hack4good-backend/db/sqlc"
	"hack4good-backend/internal/auth"
	"hack4good-backend/internal/auth/authhttp"
	"hack4good-backend/internal/env"
	"hack4good-backend/internal/users"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

// mount
func (app *application) mount() http.Handler {

	r := chi.NewRouter()

	// A good base middleware stack (from chi documentation)
	r.Use(middleware.RequestID) 
	r.Use(middleware.RealIP) 
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(middleware.Timeout(60 * time.Second)) 

	// secret key 
	var secretKey = env.GetString("secretKey", "01234567890123456789012345678901") // 32 chars
	if len(secretKey) < 32 {
		log.Fatal("secretKey must be at least 32 characters long")
	}

	// health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("all good!\n"))
  	})

	// create token maker
	tokenMaker := auth.NewJWTMaker(secretKey)

	// For users
	userService := users.NewService(repo.New(app.db))
	userHandler := users.NewHandler(userService)
	// For staff
	r.Group(func(r chi.Router) {
        r.Use(auth.RequireRole(tokenMaker, "staff"))
        r.Post("/users", userHandler.CreateUser)      // Create user
        r.Delete("/users/{id}", userHandler.DeleteUserByID) // Delete user
    })

	// For auth
	authService := authhttp.NewService(repo.New(app.db))
	authHandler := authhttp.NewHandler(authService, userService, tokenMaker)
	// For public
	r.Post("api/login", authHandler.HandleLogin)


	return r
}

//run
func (app *application) run(h http.Handler) error {
	srv := &http.Server{
		Addr:    app.config.addr,
		Handler: h,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second, 	
		IdleTimeout: time.Minute, 
	}

	log.Printf("Starting server on %s", app.config.addr)

	return srv.ListenAndServe()
}

type application struct {
	config config
	// logger
	db    *pgxpool.Pool
}

type config struct {
	addr string // server address
	db   dbConfig
}

type dbConfig struct {
	dsn string // data source name
}
