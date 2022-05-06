const { isExpiredRefToken, isExpiredAccToken, validateIdToken } = require('../../../modules/token.modules');
const { getCurrentTimestamp } = require("../../../modules/date.modules");

describe("Is expired refresh token modules", () => {
  it("Should return true", async () => {
    expect(isExpiredRefToken(0)).toEqual(true);
  })
  it("Should return false", async () => {
    expect(isExpiredRefToken(getCurrentTimestamp())).toEqual(false);
  })
})

describe("Is expired access token modules", () => {
  it("Should return true", async () => {
    expect(isExpiredAccToken(0)).toEqual(true);
  })
  it("Should return false", async () => {
    expect(isExpiredAccToken(getCurrentTimestamp())).toEqual(false);
  })
})

describe("Is valid access token and refresh token modules", () => {
  it("Should return true", async () => {
    const accToken = {
      id: 1
    }
    const refToken = {
      id: 1
    }
    expect(validateIdToken(accToken,refToken)).toEqual(true);
  })
  it("Should return false", async () => {
    const accToken = {
      id: 1
    }
    const refToken = {
      id: 2
    }
    expect(validateIdToken(accToken,refToken)).toEqual(false);
  })
})