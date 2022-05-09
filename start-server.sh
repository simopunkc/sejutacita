#!/bin/bash

kubectl apply -k ./
sleep 5
kubectl wait --for=condition=ready pod -l app=mongo
sleep 5
kubectl exec -it mongodb-replica-0 -n default -- mongosh <<EOF
rs.initiate();
var cfg = rs.conf();
cfg.members[0].host="mongodb-replica-0.mongo:27017";
rs.reconfig(cfg);
rs.add("mongodb-replica-1.mongo:27017");
rs.add("mongodb-replica-2.mongo:27017");
rs.status();
use sejutacita;
db.createCollection("user_profiles");
db.createCollection("user_logins");
EOF