import { motion } from "framer-motion";
import { useState } from "react";
import { Block } from "../types";
import { v4 as uuidv4 } from "uuid";

interface AddBlockProps {
  onAdd: (newBlock: Block) => void;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const AddBlock = ({ onAdd }: AddBlockProps) => {
  // this is a single bar containign a input field and then a button the input takes url checks it for validations and then button is used to add link to the list
  const [link, setLink] = useState("");

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAddBlock = () => {
    if (link === "") return;
    const linkDomainName = capitalizeFirstLetter(
      link.replace(/.+\/|www.|\..+/g, ""),
    );
    const newLink: Block = {
      id: uuidv4(),
      kind: "link",
      url: link,
      title: linkDomainName,
      description: `${linkDomainName} allows you to...`,
    };
    onAdd(newLink);
    setLink("");
  };

  return (
    <div className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-2xl bg-black/10 p-1 backdrop-blur-lg">
      <div className="flex w-56 flex-row items-center justify-center rounded-xl  bg-black py-2 pl-4 pr-2 text-white">
        <motion.input
          type="text"
          value={link}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddBlock();
            }
          }}
          onChange={handleLinkChange}
          className="w-full rounded-lg bg-black py-2 text-sm font-medium  outline-none"
          placeholder="Enter a link"
        />
        <motion.button
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.20)" }}
          whileTap={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          className="rounded-md p-2 text-sm font-medium outline-none"
          onClick={handleAddBlock}
        >
          Add
        </motion.button>
      </div>
    </div>
  );
};

export default AddBlock;
