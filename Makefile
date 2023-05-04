.PHONY: start restart clean

all: start

node_modules:
	@npm install

start: node_modules
	docker-compose up

restart:
	docker-compose restart

clean:
	docker-compose down

