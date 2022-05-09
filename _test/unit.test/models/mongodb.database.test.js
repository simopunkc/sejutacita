const sinon = require("sinon");
const dbConnection = require('../../../models/mongodb.database');
const database = require('../../../models/mongodb.connection');
const mongoose = require('mongoose');
const mongo = {
  Schema: {},
  model: {},
}

describe("Database connection failed", () => {
  beforeEach(() => {
    let mock = sinon.mock(mongoose);
    mock.expects("connect").once().resolves(mongo);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("Should catch error", async () => {
    let mockDB1 = sinon.mock(dbConnection);
    mockDB1.expects("getDb").once().rejects(new Error("type"));
    const model = await database.getModel();
    const blank = {
      userLogin: {},
      userProfile: {},
    }
    expect(model).toEqual(blank);
    mockDB1.verify();
    mockDB1.restore();
  });
  it("Should get uncached connection", async () => {
    let mockDB1 = sinon.mock(dbConnection);
    mockDB1.expects("getDb").once().returns(null);
    const model = await database.getModel();
    expect(model).toHaveProperty("userLogin");
    expect(model).toHaveProperty("userProfile");
    mockDB1.verify();
    mockDB1.restore();
  });
  it("Should get cached connection", async () => {
    const model = await database.getModel();
    expect(model).toHaveProperty("userLogin");
    expect(model).toHaveProperty("userProfile");
  });
});