import { ethers } from "ethers";
import { magic } from "../lib/magic";
import useSubmissionsContract from "./useSubmissionsContract";

const useAdmission = () => {
  const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
  const contract = useSubmissionsContract(provider);

  return (async () => {
    await contract.payAdmission({ value: ethers.utils.parseEther("1") });
  });
};

export default useAdmission;