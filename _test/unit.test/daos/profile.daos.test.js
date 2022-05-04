const sinon = require("sinon");
const profileDao = require('../../../daos/profile.dao');

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

describe("UPDATE user profile", () => {
  it("Should update user profile", async () => {
    let mockDB1 = sinon.mock(profileDao.userProfile);
    const obj = {
      first_name: "user",
      last_name: "pertama",
      email: "updated@web.com"
    }
    mockDB1.expects("update").once().resolves({
      first_name: obj.first_name,
      last_name: obj.last_name,
      email: obj.email
    });
    const userProfile = await profileDao.updateOneUser(obj,1);
    expect(userProfile.email).toEqual(obj.email);
    mockDB1.verify();
    mockDB1.restore();
  })
  it("Should catch error", async () => {
    let mockDB = sinon.mock(profileDao.userProfile);
    mockDB.expects("update").once().rejects(new Error("type"));
    await profileDao.updateOneUser({},"").catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  })
})

describe("DELETE user profile", () => {
  it("Should delete user profile", async () => {
    let mockDB = sinon.mock(profileDao.userProfile);
    mockDB.expects("destroy").once().resolves(1);
    const userProfile = await profileDao.deleteOneUser(1);
    expect(userProfile).toEqual(1);
    mockDB.verify();
    mockDB.restore();
  })
  it("Should catch error", async () => {
    let mockDB = sinon.mock(profileDao.userProfile);
    mockDB.expects("destroy").once().rejects(new Error("type"));
    await profileDao.deleteOneUser("").catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  })
})