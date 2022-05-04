const app = require('./server');
const request = require("supertest");
const sinon = require("sinon");
const agent = request.agent(app);
const models = require('../../models/index')
const token = require('../../modules/token.modules');
const role = require('../../modules/role.modules');
const profileDao = require('../../daos/profile.dao');

const validRefToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiZXhwaXJlZCI6MzE1MzYwMDAwMDAsImlhdCI6MTY1MTU1MzY3MH0.b6QeKHFcm6nKGsjINf_T0Sxkgo2DCDcCuIGuFweXWyw";
const validRefTokenButExpired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiZXhwaXJlZCI6MCwiaWF0IjoxNjUxNTUzNjcwfQ.Iw0JK6cZVLnEMeb7TsyhuaYB0yaqNu0oZa_28r55vd8";
const validAccTokenUser = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjYwMDAwLCJyb2xlIjoyLCJpYXQiOjE2NTE1NTM2NzB9.BSuYSXq5X38LVy5vptYPdTaqNShZXcraZwzSov9djHw";
const validAccTokenUserButDifferentId = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjYwMDAwLCJyb2xlIjoxLCJpYXQiOjE2NTE1NTM2NzB9.ovtA2E8m6haC_3xwvEmWDET1vJsnFNjqN5VSVduo0C0";
const validAccTokenButExpired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMiIsImV4cGlyZWQiOjAsInJvbGUiOjIsImlhdCI6MTY1MTU1MzY3MH0.AfXr9nUo4GD-1ZANFjF86q1AF9YwXi5JdYaE_AI-Oec";

describe("Integration Test /login", () => {
  afterEach(() => {
    sinon.restore();
  });

  afterAll(() => {
    models.sequelize.close()
  });

  describe("GET /user/:id", () => {
    describe("error 500", () => {
      it("invalid refresh token", async () => {
        await agent.get("/user/1").set("refresh_token", {}).expect(500);
      });
      it("invalid access token", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", {}).expect(500);
        mock.verify();
        mock.restore();
      });
      it("should catch error controller", async () => {
        let mock1 = sinon.mock(token);
        let mock2 = sinon.mock(role);
        mock1.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock1.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        mock2.expects("getIdUser").once().throwsException(new Error("type"));
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(500);
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
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(500);
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
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(404);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });

    describe("error 400", () => {
      it("refresh token not found", async () => {
        await agent.get("/user/1").expect(400);
      });
      it("refresh token expired", async () => {
        await agent.get("/user/1").set("refresh_token", validRefTokenButExpired).expect(400);
      });
      it("access token not found", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.get("/user/1").set("refresh_token", validRefToken).expect(400);
        mock.verify();
        mock.restore();
      });
      it("access token expired", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).once().returns(false);
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", validAccTokenButExpired).expect(400);
        mock.verify();
        mock.restore();
      });
      it("invalid id", async () => {
        let mock = sinon.mock(token);
        mock.expects("isExpiredRefToken").withArgs(sinon.match.any).returns(false);
        mock.expects("isExpiredAccToken").withArgs(sinon.match.any).returns(false);
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUserButDifferentId).expect(400);
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
        await agent.get("/user/1").set("refresh_token", validRefToken).set("access_token", validAccTokenUser).expect(200);
        mock.verify();
        mockDB.verify();
        mock.restore();
        mockDB.restore();
      });
    });
  });
});
