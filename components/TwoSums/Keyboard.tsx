import { useEffect } from "react";
import tw from "tailwind-styled-components";

const KEYS = [
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", '10'],
];

type Props = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
};

export default function Keyboard({ onKeyPress, disabled }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
        onKeyPress(e.key.toLowerCase());
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyPress]);

  return (
    <div className="grid h-min select-none gap-4 w-full m-0 pt-8">
      {KEYS.map((row, i) => (
        <div
          className="flex touch-manipulation justify-evenly gap-1 md:gap-2"
          key={`row-${i}`}
        >
          {row.map((key, j) =>
            key === "" ? (
              <div key={`empty-${j}`} className="w-2" />
            ) : (
              <KeyButton
                disabled={disabled}
                key={key}
                onClick={onKeyPress.bind(null, key.toLowerCase())}
                style={
                  disabled ? { opacity: 0.5 } : 'bg-pink-700'
                }
              >
                {key}
              </KeyButton>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export const KeyButton = tw.button`
  bg-pink-700 hover:bg-pink-500 active:opacity-60 md:p-3 
   p-2 py-4 rounded-md md:text-xl sm:text-sm text-md font-bold transition-all 
   md:min-w-[2.5rem]
   min-w-[1.85rem]
   shadow-2xl
`;
