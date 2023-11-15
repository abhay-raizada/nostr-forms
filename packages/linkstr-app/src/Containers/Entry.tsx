import { useParams } from "react-router-dom";
import WelcomeOverlay from "./WelcomeOverlay";
import CollectionViewer from "./CollectionViewer";
import CollectionBuilder from "./CollectionBuilder";

const Entry = () => {
  const { npub } = useParams();

  return (
    <div className="mx-auto w-full px-4 lg:w-[60rem] lg:px-0">
      <WelcomeOverlay />
      {npub ? <CollectionViewer npub={npub} /> : <CollectionBuilder />}
    </div>
  );
};

export default Entry;
