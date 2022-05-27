const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Submissions', function () {
  it('Should add and fetch successfully', async function () {
    const Submissions = await ethers.getContractFactory('Submissions')
    const submissions = await Submissions.deploy()
    await submissions.deployed()

    expect(await submissions.getSubmissions('w3rdle')).to.be.lengthOf(0)

    const tx1 = await submissions.addSubmission(
      'w3rdle',
      1653600546601,
      1653600561993
    )
    await tx1.wait()

    expect(await submissions.getSubmissions('w3rdle')).to.be.lengthOf(1)
    expect(await submissions.getSubmissions('twosums')).to.be.lengthOf(0)

    const tx2 = await submissions.addSubmission(
      'twosums',
      1653600546601,
      1653600561993
    )
    await tx2.wait()

    expect(await submissions.getSubmissions('w3rdle')).to.be.lengthOf(1)
    expect(await submissions.getSubmissions('twosums')).to.be.lengthOf(1)
  })
})
