package auth

import (
	"log"

	"golang.org/x/crypto/bcrypt"
)

// hash a phone number (replaces password)
func HashPhone(phone string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(phone), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		return "", err
	}

	return string(hash), nil
}

// compare phone with hash
func CheckPhone (hashed string, plain []byte) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), plain)
	return err == nil
}

// hash password
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		return "", err
	}

	return string(hash), nil
}

// compare password with hash
func CheckPassword (hashed string, plain []byte) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), plain)
	return err == nil
}