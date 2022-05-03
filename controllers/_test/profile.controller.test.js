const sinon = require("sinon");
const profileDao = require('../../models/daos/profile.dao');

describe("POST user profile", () => {
  it("Should insert into database", async () => {
    let mockDB1 = sinon.mock(profileDao.userProfile);
    let mockDB2 = sinon.mock(profileDao.userLogin);
    const obj = {
      username: "user2",
      password: "password",
      first_name: "user",
      last_name: "pertama",
      email: "user2@web.com"
    }
    mockDB1.expects("create").once().resolves({
      first_name: "user",
      last_name: "pertama",
      email: "user2@web.com"
    });
    mockDB2.expects("create").once().resolves({
      username: "user2",
      password: "password"
    });
    const userProfile = await profileDao.insertOneUser(obj);
    expect(userProfile.email).toEqual("user2@web.com");
    mockDB1.verify();
    mockDB2.verify();
    mockDB1.restore();
    mockDB2.restore();
  })
  it("Should catch error", async () => {
    let mockDB = sinon.mock(profileDao.userProfile);
    mockDB.expects("create").once().rejects(new Error("type"));
    await profileDao.insertOneUser({}).catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  })
})

describe("GET user profile", () => {
  it("Should get email from mock", async () => {
    let mockDB = sinon.mock(profileDao.userProfile);
    mockDB.expects("findByPk").once().resolves({
      email: 'user2@web.com'
    });
    const userProfile = await profileDao.getOneUser(1);
    expect(userProfile.email).toEqual('user2@web.com');
    mockDB.verify();
    mockDB.restore();
  })
  it("Should catch error", async () => {
    let mockDB = sinon.mock(profileDao.userProfile);
    mockDB.expects("findByPk").once().rejects(new Error("type"));
    await profileDao.getOneUser("").catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  })
})