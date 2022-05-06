const app = require('./server');
const request = require("supertest");
const sinon = require("sinon");
const agent = request.agent(app);
const models = require('../../models/index')
const token = require('../../modules/token.modules');
const role = require('../../modules/role.modules');
const profileDao = require('../../daos/profile.dao');

const validRefToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjMxNTM2MDAwMDAwLCJyb2xlIjoxLCJpYXQiOjE2NTE1NTM2NzB9.kXGDUopOZfW_Lvkqmg7j4Ww7G0MN6qYr9G7plXoyC6k";
const validRefTokenButExpired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjAsInJvbGUiOjEsImlhdCI6MTY1MTU1MzY3MH0.07KcHg_xYH1dRbFQHAyneawRopY49vpnauTRzvx9mQY";
const validAccTokenUser = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjYwMDAwLCJyb2xlIjoyLCJpYXQiOjE2NTE1NTM2NzB9.BSuYSXq5X38LVy5vptYPdTaqNShZXcraZwzSov9djHw";
const validAccTokenAdmin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjYwMDAwLCJyb2xlIjoxLCJpYXQiOjE2NTE1NTM2NzB9.KuTr1HIAweTQGW9Q3AZXHAntTPd1lZLJ0-3UXblIQ3A";
const validAccTokenAdminButDifferentId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjYwMDAwLCJyb2xlIjoxLCJpYXQiOjE2NTE1NTM2NzB9.ovtA2E8m6haC_3xwvEmWDET1vJsnFNjqN5VSVduo0C0";
const validAccTokenButExpired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjAsInJvbGUiOjIsImlhdCI6MTY1MTU1MzY3MH0.AfXr9nUo4GD-1ZANFjF86q1AF9YwXi5JdYaE_AI-Oec";

describe("Integration Test /admin", () => {
  afterEach(() => {
    sinon.restore();
  });

  afterAll(() => {
    models.sequelize.close()
  });

  describe("GET /admin/:id", () => {
    describe("error 500", () => {
      it("invalid refresh token", async () => {
        await agent.get("/admin/1").set("refresh_token", {}).expect(500);
      });
      it("invalid access token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", {}).expect(500);
        mock.verify();
        mock.restore();
      });
      it("invalid token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("validateIdToken").once().throwsException(new Error("type"));
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock.verify();
        mock.restore();
      });
      it("should catch error controller", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(role);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("getRole").once().throwsException(new Error("type"));
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
      it("should catch error dao", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(profileDao);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("getOneUser").once().throwsException(new Error("type"));
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
    });

    describe("error 404", () => {
      it("user not found", async () => {
        let mock = sinon.mock(token);
        let mockDB = sinon.mock(profileDao.userProfile);
        mockDB.expects("findByPk").once().resolves({});
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(404);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });

    describe("error 403", () => {
      it("invalid role", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(403);
        mock.verify();
        mock.restore();
      });
    })

    describe("error 400", () => {
      it("refresh token not found", async () => {
        await agent.get("/admin/1").expect(400);
      });
      it("refresh token expired", async () => {
        await agent.get("/admin/1").set("refresh_token", validRefTokenButExpired).expect(400);
      });
      it("access token not found", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).expect(400);
        mock.verify();
        mock.restore();
      });
      it("access token expired", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenButExpired).expect(400);
        mock.verify();
        mock.restore();
      });
      it("invalid id token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdminButDifferentId).expect(400);
        mock.verify();
        mock.restore();
      });
    });

    describe("200 ok", () => {
      it("should return 200 ok", async () => {
        let mock = sinon.mock(token);
        let mockDB = sinon.mock(profileDao.userProfile);
        mockDB.expects("findByPk").once().resolves({
          email: 'user2@web.com'
        });
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(200);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });
  });

  describe("PUT /admin/:id", () => {
    describe("error 500", () => {
      it("invalid refresh token", async () => {
        await agent.put("/admin/1").set("refresh_token", {}).expect(500);
      });
      it("invalid access token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", {}).expect(500);
        mock.verify();
        mock.restore();
      });
      it("invalid token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("validateIdToken").once().throwsException(new Error("type"));
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock.verify();
        mock.restore();
      });
      it("should catch error controller", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(role);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("getRole").once().throwsException(new Error("type"));
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
      it("should catch error dao", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(profileDao);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("updateOneUser").once().throwsException(new Error("type"));
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
    });

    describe("error 404", () => {
      it("user not found", async () => {
        let mock = sinon.mock(token);
        let mockDB = sinon.mock(profileDao.userProfile);
        mockDB.expects("update").once().resolves(0);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(404);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });

    describe("error 403", () => {
      it("invalid role", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(403);
        mock.verify();
        mock.restore();
      });
    })

    describe("error 400", () => {
      it("refresh token not found", async () => {
        await agent.put("/admin/1").expect(400);
      });
      it("refresh token expired", async () => {
        await agent.put("/admin/1").set("refresh_token", validRefTokenButExpired).expect(400);
      });
      it("access token not found", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.put("/admin/1").set("refresh_token", validRefToken).expect(400);
        mock.verify();
        mock.restore();
      });
      it("access token expired", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenButExpired).expect(400);
        mock.verify();
        mock.restore();
      });
    });

    describe("200 ok", () => {
      it("should return 200 ok", async () => {
        let mock = sinon.mock(token);
        let mockDB = sinon.mock(profileDao);
        const obj = {
          first_name: "user",
          last_name: "pertama",
          email: "updated@web.com"
        }
        mockDB.expects("updateOneUser").once().resolves(1);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.put("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).send(obj).expect(200);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });
  });

  describe("DELETE /admin/:id", () => {
    describe("error 500", () => {
      it("invalid refresh token", async () => {
        await agent.delete("/admin/1").set("refresh_token", {}).expect(500);
      });
      it("invalid access token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", {}).expect(500);
        mock.verify();
        mock.restore();
      });
      it("invalid token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).once().returns(false);
        mock.expects("validateIdToken").once().throwsException(new Error("type"));
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock.verify();
        mock.restore();
      });
      it("should catch error controller", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(role);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("getRole").once().throwsException(new Error("type"));
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
      it("should catch error dao", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(profileDao);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("deleteOneUser").once().throwsException(new Error("type"));
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(500);
        mock1.verify();
        mock2.verify();
        mock1.restore();
        mock2.restore();
      });
    });

    describe("error 404", () => {
      it("user not found", async () => {
        let mock = sinon.mock(token);
        let mockDB = sinon.mock(profileDao.userProfile);
        mockDB.expects("destroy").once().resolves(0);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(404);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });

    describe("error 403", () => {
      it("invalid role", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(403);
        mock.verify();
        mock.restore();
      });
    })

    describe("error 400", () => {
      it("refresh token not found", async () => {
        await agent.delete("/admin/1").expect(400);
      });
      it("refresh token expired", async () => {
        await agent.delete("/admin/1").set("refresh_token", validRefTokenButExpired).expect(400);
      });
      it("access token not found", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.delete("/admin/1").set("refresh_token", validRefToken).expect(400);
        mock.verify();
        mock.restore();
      });
      it("access token expired", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenButExpired).expect(400);
        mock.verify();
        mock.restore();
      });
    });

    describe("200 ok", () => {
      it("should return 200 ok", async () => {
        let mock = sinon.mock(token);
        let mockDB = sinon.mock(profileDao.userProfile);
        mockDB.expects("destroy").once().resolves(1);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.delete("/admin/1").set("refresh_token", validRefToken).set("access_token", validAccTokenAdmin).expect(200);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });
  });
})