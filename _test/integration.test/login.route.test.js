const app = require('../../server');
const request = require("supertest");
const sinon = require("sinon");
const agent = request.agent(app);
const token = require('../../modules/token.modules');
const loginDao = require('../../daos/login.dao');
const database = require('../../models/mongodb.connection');
const mongodbConnection = {
  userLogin: {
    findOne(){},
  },
}

const validRefToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjMxNTM2MDAwMDAwLCJyb2xlIjoxLCJpYXQiOjE2NTE1NTM2NzB9.kXGDUopOZfW_Lvkqmg7j4Ww7G0MN6qYr9G7plXoyC6k";
const validRefTokenButExpired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjAsInJvbGUiOjEsImlhdCI6MTY1MTU1MzY3MH0.07KcHg_xYH1dRbFQHAyneawRopY49vpnauTRzvx9mQY";

describe("Integration Test /login", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("POST /login/user", () => {
    describe("error 500", () => {
      it("should catch error", async () => {
        let mock = sinon.mock(loginDao);
        mock.expects("authUser").once().throwsException(new Error("type"));
        await agent.post("/login/user").expect(500);
        mock.verify();
        mock.restore();
      });
    });

    describe("error 404", () => {
      it("user not found", async () => {
        let mockDbConn = sinon.mock(database);
        mockDbConn.expects("getModel").once().resolves(mongodbConnection);
        let mock = sinon.mock(loginDao);
        mock.expects("authUser").once().resolves({});
        await agent.post("/login/user").expect(404);
        mockDbConn.verify();
        mock.verify();
        mockDbConn.restore();
        mock.restore();
      });
    });

    describe("200 ok", () => {
      it("should return 200 ok", async () => {
        let mockDbConn = sinon.mock(database);
        mockDbConn.expects("getModel").once().resolves(mongodbConnection);
        const obj = {
          username: "user2",
          password: "password"
        }
        let mock = sinon.mock(loginDao);
        mock.expects("authUser").once().resolves({
          accToken: "sakdlawdlwa",
          refToken: "asldakfwkfla"
        });
        await agent.post("/login/user").send(obj).expect(200);
        mockDbConn.verify();
        mock.verify();
        mockDbConn.restore();
        mock.restore();
      });
    });
  });

  describe("GET /login/refresh", () => {
    describe("error 500", () => {
      it("invalid refresh token", async () => {
        await agent.get("/login/refresh").set("refresh_token", {}).expect(500);
      });
      it("should catch error", async () => {
        let mock1 = sinon.mock(loginDao);
        let mock2 = sinon.mock(token);
        mock1.expects("updateAccToken").once().throwsException(new Error("type"));
        mock2.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/login/refresh").set("refresh_token", validRefToken).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
    });

    describe("error 404", () => {
      it("user not found", async () => {
        let mock1 = sinon.mock(loginDao);
        let mock2 = sinon.mock(token);
        mock1.expects("updateAccToken").once().resolves({});
        mock2.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/login/refresh").set("refresh_token", validRefToken).expect(404);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
    });

    describe("error 400", () => {
      it("refresh token not found", async () => {
        await agent.get("/login/refresh").expect(400);
      });
      it("refresh token expired", async () => {
        await agent.get("/login/refresh").set("refresh_token", validRefTokenButExpired).expect(400);
      });
    })

    describe("200 ok", () => {
      it("should return 200 ok", async () => {
        let mock1 = sinon.mock(loginDao);
        let mock2 = sinon.mock(token);
        mock1.expects("updateAccToken").once().resolves({
          accToken: "asjdajdwafwakf"
        });
        mock2.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/login/refresh").set("refresh_token", validRefToken).expect(200);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
    });
  });
});
