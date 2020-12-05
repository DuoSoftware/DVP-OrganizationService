module.exports = {
  DB: {
    Type: "postgres",
    User: "",
    Password: "",
    Port: 5432,
    Host: "",
    Database: ""
  },

  Redis: {
    mode: "instance", //instance, cluster, sentinel
    ip: "",
    port: 6379,
    user: "",
    password: "",
    db: 0,
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster"
    }
  },

  Security: {
    ip: "",
    port: 6379,
    user: "",
    password: "",
    db: 0,
    mode: "instance", //instance, cluster, sentinel
    sentinels: {
      hosts: "",
      port: 16389,
      name: "redis-cluster"
    }
  },

  Host: {
    profilesearch: "secondary",
    resource: "cluster",
    vdomain: "localhost",
    domain: "localhost",
    port: "3638",
    version: "1.0.0.0"
  },

  LBServer: {
    ip: "localhost",
    port: "3434"
  },

  RabbitMQ: {
    ip: "",
    port: 5672,
    user: "",
    password: "",
    vhost: "/"
  },

  Mongo: {
    ip: "",
    port: "",
    dbname: "dvpdb",
    password: "",
    user: "facetone",
    type: "mongodb+srv"
  },

  Services: {
    accessToken:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo",
    resourceServiceHost: "",
    resourceServicePort: "8831",
    resourceServiceVersion: "1.0.0.0",
    sipuserendpointserviceHost: "",
    sipuserendpointservicePort: "8086",
    sipuserendpointserviceVersion: "1.0.0.0",
    ruleserviceHost: "",
    ruleservicePort: "8816",
    ruleserviceVersion: "1.0.0.0",
    fileserviceHost: "",
    fileservicePort: "5648",
    fileserviceVersion: "1.0.0.0",
    liteticketHost: "",
    liteticketPort: "3635",
    liteticketVersion: "1.0.0.0",
    clusterconfigserviceHost: "",
    clusterconfigservicePort: "3636",
    clusterconfigserviceVersion: "1.0.0.0",
    billingserviceHost: "",
    billingservicePort: "4444",
    billingserviceVersion: "1.0.0.0",
    notificationServiceHost: "",
    notificationServicePort: "8089",
    notificationServiceVersion: "1.0.0.0",
    dynamicPort: false,
    scheduleWorkerServiceHost: "127.0.0.1",
    scheduleWorkerServicePort: "8086",
    scheduleWorkerServiceVersion: "1.0.0.0",
  },

  Tenant: {
    activeTenant: 1,
    activeCompany: 0
  },

  ClusterName: "DemoCloud",
  Provision: 1,

  ActiveDirectory: {
    groupName: "FaceTone"
  }
};
