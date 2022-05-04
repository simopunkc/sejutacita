const sinon = require("sinon");
const loginDao = require('../../../daos/login.dao');

describe("POST auth user", () => {
  it("Refresh token is not expired", async () => {
    let mockDB = sinon.mock(loginDao.userLogin);
    const obj = {
      username: "user2",
      password: "password"
    }
    mockDB.expects("findOne").once().resolves({
      id: 1,
      username: obj.username,
      password: "$2b$08$ZYq27bAmS39JMKB1yauniOIl6TEq8QajPB83iC2V1ypvJQa8koXFa"
    });
    const userLogin = await loginDao.authUser(obj);
    expect(userLogin).toHaveProperty('accToken');
    expect(userLogin).toHaveProperty('refToken');
    mockDB.verify();
    mockDB.restore();
  })
  it("Should wrong password", async () => {
    let mockDB = sinon.mock(loginDao.userLogin);
    const obj = {
      username: "user2",
      password: "password"
    }
    mockDB.expects("findOne").once().resolves({
      id: 1,
      username: obj.username,
      password: obj.password
    });
    await loginDao.authUser(obj).catch((error) => {
      expect(error.message).toEqual("wrong password");
    });
    mockDB.verify();
    mockDB.restore();
  })
  it("Should catch error", async () => {
    let mockDB = sinon.mock(loginDao.userLogin);
    mockDB.expects("findOne").once().rejects(new Error("type"));
    await loginDao.authUser({}).catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  })
})

describe("Update Access Token", () => {
  it("should update access token", async () => {
    const obj = {
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiZXhwaXJlZCI6MCwiaWF0IjoxNjUxNTUzNjcwfQ.Iw0JK6cZVLnEMeb7TsyhuaYB0yaqNu0oZa_28r55vd8",
      refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiZXhwaXJlZCI6MzE1MzYwMDAwMDAsImlhdCI6MTY1MTU1MzY3MH0.b6QeKHFcm6nKGsjINf_T0Sxkgo2DCDcCuIGuFweXWyw"
    }
    const userLogin = await loginDao.updateAccToken(obj)
    expect(userLogin).not.toEqual('expired');
  })
})