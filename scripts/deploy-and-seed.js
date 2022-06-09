const hre = require('hardhat')

async function main() {
  const SubmissionsContract = await hre.ethers.getContractFactory('Submissions')
  const contract = await SubmissionsContract.deploy()

  await contract.deployed()

  const tx1 = await contract.addSubmission(
    'w3rdle',
    'trace',
    1653600546601,
    1653600561993
  )
  await tx1.wait()

  console.log('Contract deployed to:', contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
