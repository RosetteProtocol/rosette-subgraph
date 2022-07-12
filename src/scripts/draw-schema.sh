#!/usr/bin/env bash

# Back up real schema
mv src/schema.graphql src/schema.graphql.bak

# Insert query into schema to allow graphqlviz inspect our schema
echo '
directive @entity on OBJECT
directive @derivedFrom(field: String) on FIELD_DEFINITION
scalar BigInt
scalar Bytes
schema {
  query: Query
}
type Query {
  RosetteStone: RosetteStone
}
' > src/schema.graphql

# Copy the rest of the schema
cat src/schema.graphql.bak >> src/schema.graphql

# Generate schema diagram
graphqlviz src/schema.graphql | dot -Tpng -o src/schema.png

# Overwrite modified schema with backed up version
mv src/schema.graphql.bak src/schema.graphql