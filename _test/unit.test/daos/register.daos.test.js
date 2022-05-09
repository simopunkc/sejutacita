const sinon = require("sinon");
const registerDao = require('../../../daos/register.dao');
const mongodbConnection = {
  userLogin: {
    create(){}
  },
  userProfile: {
    create(){}
  }
}

describe("POST user profile", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Should insert into database", async () => {
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
    mockDB2.expects("create").once().resolves({
      username: obj.username,
      password: obj.password
    });
    const userProfile = await registerDao.insertOneUser(mongodbConnection, obj);
    expect(userProfile.email).toEqual(obj.email);
    mockDB1.verify();
    mockDB2.verify();
    mockDB1.restore();
    mockDB2.restore();
  });
  it("Should catch error", async () => {
    let mockDB = sinon.mock(mongodbConnection.userProfile);
    mockDB.expects("create").once().rejects(new Error("type"));
    await registerDao.insertOneUser(mongodbConnection, {}).catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  });
});
