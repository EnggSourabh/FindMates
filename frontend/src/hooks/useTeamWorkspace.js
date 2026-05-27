import { useContext } from "react";
import { TeamContext } from "../context/teamContextObject";

export const useTeamWorkspace = () => {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error("useTeamWorkspace must be used inside TeamProvider");
  }

  return context;
};
