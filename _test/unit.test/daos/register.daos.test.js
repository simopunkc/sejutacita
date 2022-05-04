const sinon = require("sinon");
const registerDao = require('../../../daos/register.dao');

describe("POST user profile", () => {
  it("Should insert into database", async () => {
    let mockDB1 = sinon.mock(registerDao.userProfile);
    let mockDB2 = sinon.mock(registerDao.userLogin);
    const obj = {
      username: "user2",
      password: "ywueyuwdhajs",
      first_name: "user",
      last_name: "pertama",
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
    const userProfile = await registerDao.insertOneUser(obj);
    expect(userProfile.email).toEqual(obj.email);
    mockDB1.verify();
    mockDB2.verify();
    mockDB1.restore();
    mockDB2.restore();
  })
  it("Should catch error", async () => {
    let mockDB = sinon.mock(registerDao.userProfile);
    mockDB.expects("create").once().rejects(new Error("type"));
    await registerDao.insertOneUser({}).catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  })
})
