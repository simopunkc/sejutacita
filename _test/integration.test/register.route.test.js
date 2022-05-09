const app = require('../../server');
const request = require("supertest");
const sinon = require("sinon");
const agent = request.agent(app);
const registerDao = require('../../daos/register.dao');
const database = require('../../models/mongodb.connection');
const mongodbConnection = {
  userLogin: {
    create(){}
  },
  userProfile: {
    create(){}
  }
}

describe("Integration Test /register", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /register/user", () => {
    describe("error 500", () => {
      it("should catch error", async () => {
        let mockDB = sinon.mock(registerDao);
        mockDB.expects("insertOneUser").once().rejects(new Error("type"));
        await agent.post("/register/user").expect(500);
        mockDB.verify();
        mockDB.restore();
      });
    });

    describe("error 400", () => {
      it("should user registration failed", async () => {
        let mockDbConn = sinon.mock(database);
        mockDbConn.expects("getModel").once().resolves(mongodbConnection);
        let mockDB1 = sinon.mock(mongodbConnection.userProfile);
        let mockDB2 = sinon.mock(mongodbConnection.userLogin);
        const obj = {
          username: "user2",
          password: "ywueyuwdhajs",
          first_name: "user",
          last_name: "kedua",
          email: "user2@web.com"
        }
        mockDB1.expects("create").once().resolves({
          first_name: obj.first_name
        });
        mockDB2.expects("create").once().resolves({});
        await agent.post("/register/user").send(obj).expect(400);
        mockDbConn.verify();
        mockDB1.verify();
        mockDB2.verify();
        mockDbConn.restore();
        mockDB1.restore();
        mockDB2.restore();
      });
    });

    describe("201 created", () => {
      it("should return 201 created", async () => {
        let mockDbConn = sinon.mock(database);
        mockDbConn.expects("getModel").once().resolves(mongodbConnection);
        let mockDB1 = sinon.mock(mongodbConnection.userProfile);
        let mockDB2 = sinon.mock(mongodbConnection.userLogin);
        const obj = {
          username: "user2",
          password: "ywueyuwdhajs",
          first_name: "user",
          last_name: "kedua",
          email: "user2@web.com"
        }
        mockDB1.expects("create").once().resolves({
          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email
        });
        mockDB2.expects("create").once().resolves({});
        await agent.post("/register/user").send(obj).expect(201);
        mockDbConn.verify();
        mockDB1.verify();
        mockDB2.verify();
        mockDbConn.restore();
        mockDB1.restore();
        mockDB2.restore();
      });
    });
  });
})