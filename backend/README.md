# Creating backend 
1. Creating Go
    ```go mod init github.com/0218hy/hack4good2026.git```
2. Installing sqlc
    ```brew install sqlc```
3. Installing goose
    ```brew install goose```


# SQLC
1. Generating code
    ```sqlc generate```


# Goose
1. Creating SQL Migration 
     ```goose -dir db/migrations -s create create_products sql```
2. Run the migrations
    ```goose up```


# Running go
```go run cmd/*.go```

# Creating posgtresql database
1. Connect to default DB
    ```psql -d postgres```
2. Create user and database
    ```CREATE USER h4g_user WITH PASSWORD 'h4g_password';```
    ```CREATE DATABASE h4g OWNER h4g_user;```
3. To exit
    ```\q```

# Updating my backend database
1. Connect to PostgreSQL
    ```psql -h localhost -U h4g_user -d h4g```
2. List database
    ```\l``` 
3. Connect to database
    ```\c h4g```
4. Check current Goose migration
    ```SELECT * FROM goose_db_version;```
5. Remove applied migration (if needed)
    ```DELETE FROM goose_db_version WHERE version_id = <version_number>```
6. Verify current tables
    ```\dt```
