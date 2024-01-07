import linkIcon from "../Images/link.svg";
import cancelIcon from "../Images/cancel.svg";
import handleIcon from "../Images/handle.svg";
import { Reorder, motion, useDragControls } from "framer-motion";
import { Blocks, Link, ViewMode } from "../types";
import { useEditable } from "use-editable";
import { useRef } from "react";

const BlockComponent = ({
  mode,
  index,
  blocks,
  onBlocksChange,
}: {
  mode: ViewMode;
  index: number;
  blocks: Blocks;
  onBlocksChange: (updatedBlocks: Blocks) => void;
}) => {
  const currentBlock = blocks[index];

  const controls = useDragControls();

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const urlRef = useRef(null);

  useEditable(titleRef, (value) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...currentBlock, title: value };
    onBlocksChange(newBlocks);
  });

  useEditable(descriptionRef, (value) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...currentBlock, description: value };
    onBlocksChange(newBlocks);
  });

  useEditable(urlRef, (value) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...currentBlock, url: value };
    onBlocksChange(newBlocks);
  });

  switch (mode) {
    case "view":
      if (currentBlock.kind === "link") {
        const { url, title, description } = currentBlock as Link;
        return (
          <a href={url} className="no-underline">
            <div className="relative flex w-full flex-col border-b bg-white pb-4 sm:pb-6">
              <div className="flex flex-row items-center">
                <img src={linkIcon} alt="" />
                <div className="rounded-lg px-2 pt-1.5 font-serif text-xl">
                  {title}
                </div>
              </div>
              <span className="rounded-lg text-xs text-black/40 sm:text-sm">
                {url}
              </span>
              <div className="mt-2 sm:mt-3">
                <span className="rounded-lg py-8 text-sm text-black/60 sm:text-base">
                  {description}
                </span>
              </div>
            </div>
          </a>
        );
      } else {
        return null;
      }
    case "edit":
      if (currentBlock.kind === "link") {
        const { url, title, description } = currentBlock as Link;

        const handleDelete = () => {
          const newBlocks = [...blocks];
          newBlocks.splice(index, 1);
          onBlocksChange(newBlocks);
        };

        return (
          <Reorder.Item
            value={currentBlock}
            dragListener={false}
            dragControls={controls}
            className="relative flex w-full flex-col border-b bg-white pb-4 sm:pb-6"
          >
            <div
              className="action-button absolute -right-2.5"
              onClick={handleDelete}
            >
              <img src={cancelIcon} alt="" />
            </div>

            <div className="flex flex-row items-center">
              <img
                src={handleIcon}
                style={{ touchAction: "none" }}
                alt="handle used for reordering list elements"
                className="action-button__no-bg cursor-grab pr-2 active:cursor-grabbing"
                onPointerDown={(e) => {
                  controls.start(e);
                  e.preventDefault();
                }}
              />

              <img src={linkIcon} alt="" />
              <motion.div
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                ref={titleRef}
                className="rounded-lg px-2 pt-1.5 font-serif text-xl outline-none"
              >
                {title}
              </motion.div>
            </div>
            <div>
              <motion.span
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                ref={urlRef}
                className="rounded-lg text-xs text-black/40 outline-none sm:text-sm"
              >
                {url}
              </motion.span>
            </div>
            <div className="mt-2 sm:mt-3">
              <motion.span
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                ref={descriptionRef}
                className="rounded-lg text-sm text-black/60 outline-none sm:text-base"
              >
                {description}
              </motion.span>
            </div>
          </Reorder.Item>
        );
      } else {
        return null;
      }
  }
};

interface AllBlocksProps {
  mode: ViewMode;
  blocks: Blocks;
  onBlocksChange?: (updatedBlocks: Blocks) => void;
}

const AllBlocks = ({
  mode,
  blocks,
  onBlocksChange = () => {},
}: AllBlocksProps) => {
  return (
    <Reorder.Group
      axis="y"
      onReorder={onBlocksChange}
      values={blocks}
      className="mt-14 flex flex-col gap-4 sm:gap-6"
    >
      {blocks.map((block, index) => (
        <BlockComponent
          mode={mode}
          index={index}
          blocks={blocks}
          onBlocksChange={onBlocksChange}
          key={block.id}
        />
      ))}
    </Reorder.Group>
  );
};

export default AllBlocks;
