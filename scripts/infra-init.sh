#!/bin/bash

echo "Waiting for Kafka Connect to be available..."
while ! curl -s http://connect:8083/ | grep -q "version"; do
  echo "Kafka Connect is not ready yet. Retrying in 5 seconds..."
  sleep 5
done

echo "Registering PostgreSQL Debezium Connector..."
curl -X POST http://connect:8083/connectors -H "Content-Type: application/json" -d '{
  "name": "postgres-connector",
  "config": {
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "memopad",
    "database.password": "memopad",
    "database.dbname": "memopad",
    "database.server.name": "postgres",
    "table.include.list": "public.note",
    "slot.name": "debezium_slot",
    "plugin.name": "pgoutput",
    "publication.autocreate.mode": "filtered"
  }
}'

echo "Registering Elasticsearch Sink Connector..."
curl -X POST http://connect:8083/connectors -H "Content-Type: application/json" -d '{
  "name": "elasticsearch-sink",
  "config": {
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "connection.url": "http://elasticsearch:9200",
    "tasks.max": "1",
    "topics": "postgres.public.note",
    "key.ignore": "true",
    "schema.ignore": "true",
    "type.name": "_doc",
    "behavior.on.null.values": "delete",
    "connection.username": "memopad",
    "connection.password": "memopad"
  }
}'

echo "Connectors successfully registered. Exiting..."
exit 0
