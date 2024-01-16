import Sidebar from "./components/Sidebar";
import { QuestionsList } from "./components/QuestionsList";
import Settings from "./components/Settings";
import StyledWrapper from "./index.style";
import { useRef, useState } from "react";
import { useOutsideClickHandler } from "./hooks/useOutsideClickHandler";
import useFormBuilderContext from "./hooks/useFormBuilderContext";

function FormBuilder() {
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const leftSidebarRef = useRef<HTMLInputElement>(null);
  const rightSidebarRef = useRef<HTMLInputElement>(null);

  const {
    isRightSettingsOpen,
    formName,
    closeOnOutsideClick: closeSettingsOnOutsideClick,
  } = useFormBuilderContext();

  const toggleLeftMenu = () => {
    setIsLeftMenuOpen((open) => {
      return !open;
    });
  };

  const closeOnOutsideClick = () => {
    isLeftMenuOpen && toggleLeftMenu();
  };

  useOutsideClickHandler(leftSidebarRef, closeOnOutsideClick);
  useOutsideClickHandler(rightSidebarRef, closeSettingsOnOutsideClick);
  console.log("form name received is", formName);

  return (
    <StyledWrapper
      $isOpen={isLeftMenuOpen}
      $isRightSettingsOpen={isRightSettingsOpen}
    >
      <div style={{ display: "flex", maxWidth: "100vw" }}>
        <Sidebar ref={leftSidebarRef} />
        <QuestionsList onAddClick={toggleLeftMenu} />
        <Settings ref={rightSidebarRef} />
      </div>
    </StyledWrapper>
  );
}

export default FormBuilder;
