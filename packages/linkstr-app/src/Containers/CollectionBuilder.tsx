import { createLinkCollection } from "../nostr";
import { useState } from "react";
import { Header } from "../Components/Header";
import AllBlocks from "../Components/AllBlocks";
import TitleAndDescription from "../Components/TitleAndDescription";
import AddBlock from "../Components/AddBlock";
import { Block, Blocks, Collection, Metadata } from "../types";

export const defaultMetadata: Metadata = {
  title: "My Link Collection",
  description: "This is a link collection I made with nostr.",
  author: "John Doe",
  date: new Date().toISOString().split("T")[0],
};

export const defaultBlocks: Blocks = [
  {
    id: "2",
    kind: "link",
    url: "https://google.com",
    title: "Google",
    description: "Search the web",
  },
  {
    id: "3",
    kind: "link",
    url: "https://youtube.com",
    title: "Youtube",
    description: "Watch videos",
  },
];

const CollectionBuilder = () => {
  const [metadata, setMetadata] = useState<Metadata>(defaultMetadata);
  const [blocks, setBlocks] = useState<Blocks>(defaultBlocks);
  const [publishUrl, setPublishUrl] = useState<string>("");

  async function handlePublish() {
    const collection: Collection = {
      metadata: metadata,
      blocks: blocks,
    };
    const response = await createLinkCollection(collection);
    setPublishUrl(`${window.location.host}/#/${response[0]}`);
    setMetadata(defaultMetadata);
    setBlocks(defaultBlocks);
  }

  return (
    <>
      {publishUrl !== "" && (
        <div className="text-md z-30 mx-auto mt-40 w-60 break-all text-center font-bold text-black/60 backdrop-blur-3xl">
          Success! Your link collection is live. Share it with your friends and
          family using - <br /> <br /> {publishUrl}
        </div>
      )}
      <div
        className={`h-full w-full ${
          publishUrl === "" ? "blur-none" : "blur-3xl"
        }`}
      >
        <div className="h-full w-full">
          <Header
            mode="edit"
            showPublishButton={true}
            onPublish={handlePublish}
          />
          <div className="mx-auto w-full md:w-[40rem]">
            <TitleAndDescription
              mode="edit"
              metadata={metadata}
              // is this correct ??
              onMetadataChange={(updatedMetadata) =>
                setMetadata(updatedMetadata)
              }
            />
            <AllBlocks
              mode="edit"
              blocks={blocks}
              onBlocksChange={(updatedBlocks: Blocks) =>
                setBlocks(updatedBlocks)
              }
            />
            {/* Footer */}
            <div className="pb-[12rem]"></div>
          </div>
        </div>
      </div>
      {publishUrl === "" && (
        <AddBlock
          onAdd={(newBlock: Block) => setBlocks([...blocks, newBlock])}
        />
      )}
    </>
  );
};

export default CollectionBuilder;
