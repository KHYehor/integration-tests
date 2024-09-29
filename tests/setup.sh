#!/bin/sh

cp .env.tests .env
docker compose -f docker-compose.test.yaml up -d
while ! docker logs --tail 10 node_container | grep "Nest application successfully started";
do
    sleep 1
done
