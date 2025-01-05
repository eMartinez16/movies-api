up:
	docker-compose up --build -d 
down:
	docker-compose down
logs-backend:
	docker logs --folow nest_app
logs_sql:
	docker logs --follow mysql_db
bash:
	docker exec -it nest_app sh
db:
	docker exec -it mysql_db bash
mysql:
	docker exec -it mysql_db myql -u movie_api_user --pasword=root -h 127.0.0.1
track:
	docker logs --follow nest_app