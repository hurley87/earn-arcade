import { useCallback, useEffect } from "react";
import { match } from "ts-pattern";
import { always, propEq } from "ramda";
import tw from "tailwind-styled-components";
import { TileProps } from "./Tile";
import { flatten } from "ramda";

export const BackspaceIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="15"
      viewBox="0 0 24 20"
      width="15"
    >
      <path
        fill="currentcolor"
        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
      ></path>
    </svg>
);
  

export const MAPPABLE_KEYS = {
  backspace: <BackspaceIcon />,
  enter: "ENTER",
} as const;

export type MappableKeys = keyof typeof MAPPABLE_KEYS;

export function isMappableKey(key: string): key is MappableKeys {
  return key in MAPPABLE_KEYS;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
  ["enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
];

export const VALID_KEYS = KEYS.flatMap((row) =>
  row.map((key) => key.toLowerCase())
).filter(Boolean);

function isValidKey(key: string) {
  return VALID_KEYS.includes(key);
}

type Props = {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  data: TileProps[][];
};

export default function Keyboard({ onKeyPress, disabled, data }: Props) {
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (isValidKey(e.key.toLowerCase())) {
        onKeyPress(e.key.toLowerCase());
      }
    }

    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyPress]);

  const usedKeys: TileProps[] = []
  const allKeys = flatten(data)
  for(const i in allKeys) {
    const tile = allKeys[i]
    if(tile.children !== "" && tile.variant !== 'empty') usedKeys.push(tile)
  }

  const getKeyColors = useCallback(
    (key: string) => {
      const tiles = usedKeys.filter(k => k.children === key);
      if (tiles.length > 0) {
        const tile =
          tiles.find(propEq("variant", "correct")) ??
          tiles.find(propEq("variant", "present")) ??
          tiles.find(propEq("variant", "absent"));

        return {
          color: tile?.variant ? "white" : "black",
          background: match(tile?.variant ?? "empty")
            .with("absent", always("rgb(75 85 99)"))
            .with("correct", always("rgb(34 197 94)"))
            .with("present", always("rgb(234 179 8)"))
            .otherwise(always("")),
        };
      }

      return {};
    },
    []
  );

  return (
    <div className="mx-auto grid h-min select-none gap-4">
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
                  disabled ? { opacity: 0.5 } : getKeyColors(key.toLowerCase())
                }
              >
                {isMappableKey(key) ? MAPPABLE_KEYS[key] : key}
              </KeyButton>
            )
          )}
        </div>
      ))}
    </div>
  );
}

export const KeyButton = tw.button`
  bg-gray-300 hover:bg-gray-400 active:opacity-60 md:p-3 
   p-2 rounded-md md:text-xl sm:text-sm text-xs font-bold transition-all 
   md:min-w-[2.5rem]
   min-w-[1.85rem]
`;
