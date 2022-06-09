import * as React from "react";
import truncateMiddle from "truncate-middle";

const Username = ({address}) => {
    return (
        <div>
          {truncateMiddle(address || "", 5, 4, "...")}
        </div>
    );
};

export default Username;