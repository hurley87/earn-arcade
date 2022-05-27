// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SubmissionsContract = await hre.ethers.getContractFactory('Submissions')
  const contract = await SubmissionsContract.deploy()

  await contract.deployed()

  const tx1 = await contract.addSubmission(
    'w3rdle',
    1653600546601,
    1653600561993
  )
  await tx1.wait()

  const tx2 = await contract.addSubmission(
    'w3rdle',
    1653601185773,
    1653601192162
  )
  await tx2.wait()

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
