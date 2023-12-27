import { Routes, Route, Navigate } from "react-router-dom";
import Drafts from "../Drafts";
import Local from "../Local";
import Nostr from "../Nostr";
import { ROUTES } from "../../configs/routes";

function Routing() {
  return (
    <Routes>
      <Route path={ROUTES.DRAFTS} element={<Drafts />} />
      <Route path={ROUTES.LOCAL} element={<Local />} />
      <Route path={ROUTES.NOSTR} element={<Nostr />} />
      <Route path={"/"} element={<Navigate replace to={ROUTES.DRAFTS} />} />
    </Routes>
  );
}

export default Routing;
