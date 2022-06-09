import * as wagmi from "wagmi";
import { useProvider, useSigner } from "wagmi";
import type { BigNumber } from "ethers";
// Import our contract ABI (a json representation of our contract's public interface).
// The hardhat compiler writes this file to artifacts during compilation.
import SubmissionsContract from "../artifacts/contracts/Submissions.sol/Submissions.json";

export interface Submission {
  answer: string;
  id: string;
  game: string;
  start: number;
  end: number;
  creator_address: string;
  created_at: BigNumber;
}

export enum EventType {
  SubmissionAdded = "SubmissionAdded",
}

const useSubmissionsContract = () => {
  // An ethers.Signer instance associated with the signed-in wallet.
  // https://docs.ethers.io/v5/api/signer/
  const signer = useSigner();
  // An ethers.Provider instance. This will be the same provider that is  
  // passed as a prop to the WagmiProvider.
  const provider = useProvider();

  // This returns a new ethers.Contract ready to interact with our submissions API.
  // We need to pass in the address of our deployed contract as well as its abi.
  // We also pass in the signer if there is a signed in wallet, or if there's
  // no signed in wallet then we'll pass in the connected provider.
  const contract = wagmi.useContract({
    addressOrName: "0x6357e792d80315b648CDe9A0Ba9ee138A9215e18",
    contractInterface: SubmissionsContract.abi,
    signerOrProvider: signer.data || provider,
  });

  // Wrapper to add types to our getSubmissions function.
  const getSubmissions = async (game: string): Promise<Submission[]> => {
    return contract.getSubmissions(game).then((submissions: any[]) => {
      // Each submission is represented as array by default so we convert to object
      return submissions.map((c) => ({ ...c }));
    });
  };

  // Wrapper to add types to our addSubmission function.
  const addSubmission = async (game: string, answer: string, start: number, end: number): Promise<void> => {
    // Create a new transaction
    const tx = await contract.addSubmission(game, answer, start, end);
    // Wait for transaction to be mined
    await tx.wait();
  };

  const payAdmission = async (value: {value: BigNumber}) => {
    // Create a new transaction
    const tx = await contract.admission(value);
    // Wait for transaction to be mined
    await tx.wait();
  }

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getSubmissions,
    addSubmission,
    payAdmission
  };
};

export default useSubmissionsContract;