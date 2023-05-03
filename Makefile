.DEFAULT_GOAL := start
.PHONY: all start restart stop

all: start restart

start:
	docker-compose up

restart:
	docker-compose restart

stop:
	docker-compose stop

