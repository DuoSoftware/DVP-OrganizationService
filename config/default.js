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
    resourceServiceHost: "resourceservice.app.veery.cloud",
    resourceServicePort: "8831",
    resourceServiceVersion: "1.0.0.0",
    sipuserendpointserviceHost: "sipuserendpointservice.app.veery.cloud",
    sipuserendpointservicePort: "8086",
    sipuserendpointserviceVersion: "1.0.0.0",
    ruleserviceHost: "ruleservice.app1.veery.cloud",
    ruleservicePort: "8816",
    ruleserviceVersion: "1.0.0.0",
    fileserviceHost: "fileservice.app1.veery.cloud",
    fileservicePort: "5648",
    fileserviceVersion: "1.0.0.0",
    liteticketHost: "liteticket.app1.veery.cloud",
    liteticketPort: "3635",
    liteticketVersion: "1.0.0.0",
    clusterconfigserviceHost: "clusterconfig.app1.veery.cloud",
    clusterconfigservicePort: "3636",
    clusterconfigserviceVersion: "1.0.0.0",
    billingserviceHost: "billingservice.app.veery.cloud",
    billingservicePort: "4444",
    billingserviceVersion: "1.0.0.0",
    notificationServiceHost: "notificationservice.app1.veery.cloud",
    notificationServicePort: "8089",
    notificationServiceVersion: "1.0.0.0",
    dynamicPort: false
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
