import { useEffect, useState } from "react";
import downArrowArt from "../Images/downArrowArt.png";
import TitleAndDescription from "../Components/TitleAndDescription";
import { Collection } from "../types";
import { defaultBlocks, defaultMetadata } from "./CollectionBuilder";
import AllBlocks from "../Components/AllBlocks";
import { getLinkCollection } from "../nostr";
import { Logo } from "../Components/Header";

interface CollectionViewerProps {
  npub: string;
}

const CollectionViewer = ({ npub }: CollectionViewerProps) => {
  const [collection, setCollection] = useState<Collection | null>(null);

  useEffect(() => {
    async function get() {
      let event = await getLinkCollection(npub);
      let parsedCollection = JSON.parse(event[0]?.content);
      setCollection(parsedCollection);
    }
    get();
  }, [npub]);

  return (
    <div className="h-full w-full">
      <div className="relative h-16">
        <img
          src={downArrowArt}
          alt=""
          className="absolute -top-12 left-1/2 h-36 -translate-x-1/2"
        />
      </div>
      <div className="mx-auto w-full md:w-[40rem]">
        <TitleAndDescription
          mode="view"
          metadata={collection?.metadata ?? defaultMetadata}
        />
        <AllBlocks mode="view" blocks={collection?.blocks ?? defaultBlocks} />
        <div className="flex flex-row items-center justify-center pb-12 pt-32">
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default CollectionViewer;
