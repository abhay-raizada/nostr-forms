import { useRef } from "react";
import { useEditable } from "use-editable";
import { motion } from "framer-motion";
import { Metadata, ViewMode } from "../types";

interface TitleAndDescriptionProps {
  mode: ViewMode;
  metadata: Metadata;
  onMetadataChange?: (metadata: Metadata) => void;
}

const TitleAndDescription = ({
  mode,
  metadata,
  onMetadataChange = () => {},
}: TitleAndDescriptionProps) => {
  const { title, description, author } = metadata;

  // Refs and useEditable only useful for edit mode
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const authorRef = useRef(null);

  useEditable(titleRef, (value) =>
    onMetadataChange({ ...metadata, title: value }),
  );
  useEditable(descriptionRef, (value) =>
    onMetadataChange({ ...metadata, description: value }),
  );
  useEditable(authorRef, (value) =>
    onMetadataChange({ ...metadata, author: value }),
  );

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  switch (mode) {
    case "view":
      return (
        <div className="mx-auto mt-14 text-center">
          <div className="h1 pt-4">{title}</div>
          <div className="flex flex-row items-center justify-center text-xs text-black/40">
            <span>curated by – </span>
            <span className="rounded-lg p-2 font-bold">{author}</span>
            <span className="font-bold"> • {formattedDate} </span>
          </div>
          <div className="mt-4 rounded-lg p-2 text-base text-black/60 sm:text-lg">
            {description}
          </div>
        </div>
      );
    case "edit":
      return (
        <div className="mx-auto mt-14 text-center">
          <motion.div
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            className="h1 rounded-2xl pt-4 outline-none"
            ref={titleRef}
          >
            {title}
          </motion.div>
          <div className="flex flex-row items-center justify-center text-xs text-black/40">
            <span>curated by – </span>
            <motion.span
              whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
              whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
              className="rounded-lg p-2 font-bold outline-none"
              ref={authorRef}
            >
              {author}
            </motion.span>
            <span className="font-bold"> • {formattedDate} </span>
          </div>
          <motion.div
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            whileTap={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            className="mt-4 rounded-lg p-2 text-base text-black/60 outline-none sm:text-lg"
            ref={descriptionRef}
          >
            {description}
          </motion.div>
        </div>
      );
  }
};

export default TitleAndDescription;
