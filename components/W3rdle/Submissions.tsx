import * as React from "react";
import useSubmissions from "../../hooks/useHooks";
import Username from "../Username";
import * as blockies from 'blockies-ts';
import useEvents from "../../hooks/useEvents";

interface SubmissionsProps {
  game: string;
}

const Submissions: React.FunctionComponent<SubmissionsProps> = ({ game }) => {
  const query = useSubmissions({ game });

  useEvents({ game });

  function timeToHMS(submission) {
    const start = submission.start.toNumber();
    const end = submission.end.toNumber();
    const ms = end - start;
    let seconds: number = ms / 1000;
    seconds = seconds % 3600;
    const minutes = Math.floor( seconds / 60 );
    seconds = seconds % 60;
    return [minutes, seconds.toFixed(2)]
  }

  return (
    <div className="mt-4 px-2">
      {
        query.isLoading && (
          <div className="mx-auto max-w-sm text-center">
            <svg role="status" className="w-8 h-8 mr-2 text-white animate-spin dark:text-white fill-pink-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        )
      }
      <div className="pb-4">
      <p className="mb-6 text-center w-full"><a className='text-pink-500 border-b-2 border-pink-500 mb-6' href="https://polygonscan.com/address/0x6357e792d80315b648CDe9A0Ba9ee138A9215e18" target="_blank">Verify contract transactions</a></p>
      <div className="relative text-xs md:text-md xs:max-w-11/12 max-h-80 overflow-x-auto border-2 border-white rounded-md p-2">
        <table className="table-auto mx-auto">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col" className="px-8 py-4 text-left">Player</th>
              <th scope="col" className="px-8 py-4 text-left">Answer</th>
              <th scope="col" className="px-8 py-4 text-left">Minutes</th>
              <th scope="col" className="pl-8 py-4 text-right">Seconds</th>
            </tr>
          </thead>
          <tbody>
          {
            query.data?.filter(sub => (sub.end - sub.start) > 0).sort((a, b) => {
              return (a.end - a.start) - (b.end - b.start);
            }).map((submission, i) => (
              <tr>
                <td>{i + 1}</td>
                <td className="px-8 py-4">
                  <div className="flex">
                    <div className="w-6 h-6 mr-2">
                      <img className="rounded-full mr-4" src={blockies.create({ seed: submission.creator_address }).toDataURL()} />
                    </div>
                    <Username address={submission.creator_address}/>
                  </div>
                </td>
                <td className="px-8 py-4 text-left">
                  {submission.answer}
                </td>
                <td className="px-8 py-4 text-left">
                  {timeToHMS(submission)[0]}
                </td>
                <td className="pl-8 py-4 text-right">
                  {timeToHMS(submission)[1]}
                </td>
              </tr> 
            ))
          }
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Submissions;