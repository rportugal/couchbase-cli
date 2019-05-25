# Example config
```
{
  "configs": [
    {
      "name": "Couchbase Test",
      "url": "https://some.ip:18091",
      "username": "username",
      "password": "password",
      "insecure": "true"
    },
    {
      "name": "Couchbase Stg",
      "url": "https://some.ip:18091",
      "username": "username",
      "password": "password",
      "insecure": "true"
    }
  ]
}
```

# Commands
```
couchbase-cli get <bucket> <documentId>
couchbase-cli query <bucket> <query>
couchbase-cli list <bucket> <skip> <limit>
```
