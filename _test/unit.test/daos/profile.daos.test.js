const sinon = require("sinon");
const redisConnection = require("../../../models/redis.connection");
const profileDao = require('../../../daos/profile.dao');
const profileDaoRedis = require('../../../daos/profile.dao.redis');
const mongodbConnection = {
  userLogin: {
    findOneAndDelete(){},
  },
  userProfile: {
    findOne(){},
    findOneAndUpdate(){},
    findOneAndDelete(){},
  }
}

describe("GET user profile", () => {
  beforeAll(async () => {
    await redisConnection.redis.flushall();
  });

  afterEach(() => {
    sinon.restore();
  });
  
  it("Should get email from database", async () => {
    let mockDB = sinon.mock(mongodbConnection.userProfile);
    mockDB.expects("findOne").once().resolves({
      email: 'user2@web.com'
    });
    const userProfile = await profileDaoRedis.getOneUser(mongodbConnection, 1);
    expect(userProfile.email).toEqual('user2@web.com');
    mockDB.verify();
    mockDB.restore();
  });
  it("Should get email from redis", async () => {
    let mockDB = sinon.mock(redisConnection.redis);
    mockDB.expects("get").once().resolves(JSON.stringify({
      email: 'user2@web.com'
    }));
    const userProfile = await profileDaoRedis.getOneUser(mongodbConnection, 1);
    expect(userProfile.email).toEqual('user2@web.com');
    mockDB.verify();
    mockDB.restore();
  });
  it("Should catch error", async () => {
    let mockDB = sinon.mock(mongodbConnection.userProfile);
    mockDB.expects("findOne").once().rejects(new Error("type"));
    await profileDaoRedis.getOneUser(mongodbConnection, "").catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  });
});

describe("UPDATE user profile", () => {
  it("Should update user profile", async () => {
    let mockDB1 = sinon.mock(mongodbConnection.userProfile);
    const obj = {
      first_name: "user",
      last_name: "kedua",
      email: "updated@web.com"
    }
    mockDB1.expects("findOneAndUpdate").once().resolves({
      first_name: obj.first_name,
      last_name: obj.last_name,
      email: obj.email
    });
    const userProfile = await profileDao.updateOneUser(mongodbConnection, obj,1);
    expect(userProfile.email).toEqual(obj.email);
    mockDB1.verify();
    mockDB1.restore();
  });
  it("Should catch error", async () => {
    let mockDB = sinon.mock(mongodbConnection.userProfile);
    mockDB.expects("findOneAndUpdate").once().rejects(new Error("type"));
    await profileDao.updateOneUser(mongodbConnection, {},"").catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  });
});

describe("DELETE user profile", () => {
  it("Should delete user profile", async () => {
    let mockDB1 = sinon.mock(mongodbConnection.userProfile);
    let mockDB2 = sinon.mock(mongodbConnection.userLogin);
    mockDB1.expects("findOneAndDelete").once().resolves(1);
    mockDB2.expects("findOneAndDelete").once().resolves(1);
    const userProfile = await profileDao.deleteOneUser(mongodbConnection, 1);
    expect(userProfile).toEqual(1);
    mockDB1.verify();
    mockDB2.verify();
    mockDB1.restore();
    mockDB2.restore();
  });
  it("Should catch error", async () => {
    let mockDB = sinon.mock(mongodbConnection.userProfile);
    mockDB.expects("findOneAndDelete").once().rejects(new Error("type"));
    await profileDao.deleteOneUser(mongodbConnection, "").catch((error) => {
      expect(error.message).toEqual("type");
    });
    mockDB.verify();
    mockDB.restore();
  });
});