import Sidebar from "./components/Sidebar";
import { QuestionsList } from "./components/QuestionsList";
import FormBuilderProvider from "./providers/FormBuilder";
import Settings from "./components/Settings";
import StyledWrapper from "./index.style";
import { useState } from "react";

function FormBuilder() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onOpenMenu = () => {
    setIsMenuOpen((open) => {
      return !open;
    });
  };

  return (
    <StyledWrapper $isOpen={isMenuOpen}>
      <FormBuilderProvider>
        <div style={{ display: "flex", maxWidth: "100vw" }}>
          <Sidebar className="left-sidebar" />
          <QuestionsList className="main-content" onOpenMenu={onOpenMenu} />
          <Settings />
        </div>
      </FormBuilderProvider>
    </StyledWrapper>
  );
}

export default FormBuilder;
