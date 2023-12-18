import Sidebar from "./components/Sidebar";
import { QuestionsList } from "./components/QuestionsList";
import FormBuilderProvider from "./providers/FormBuilder";
import Settings from "./components/Settings";
import StyledWrapper from "./index.style";
import { useRef, useState } from "react";
import { useOutsideClickHandler } from "./hooks/useOutsideClickHandler";

function FormBuilder() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const sidebarRef = useRef(null);
  const sidebarRef = useRef<HTMLInputElement>(null);
  const onOpenMenu = () => {
    setIsMenuOpen((open) => {
      return !open;
    });
  };

  const closeOnOutsideClick = () => {
    isMenuOpen && onOpenMenu();
  };

  useOutsideClickHandler(sidebarRef, closeOnOutsideClick);

  return (
    <StyledWrapper $isOpen={isMenuOpen}>
      <FormBuilderProvider>
        <div style={{ display: "flex", maxWidth: "100vw" }}>
          <Sidebar ref={sidebarRef} className="left-sidebar" />
          <QuestionsList className="main-content" onOpenMenu={onOpenMenu} />
          <Settings />
        </div>
      </FormBuilderProvider>
    </StyledWrapper>
  );
}

export default FormBuilder;
