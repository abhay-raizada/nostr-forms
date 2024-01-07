import linkstrLogo from "../Images/logo.svg";
import { ViewMode } from "../types";
interface HeaderProps {
  mode?: ViewMode;
  showPublishButton?: boolean;
  onPublish?: () => void;
}

const Logo = () => (
  <a href="https://links.formstr.app/" className="flex flex-row items-center">
    <img src={linkstrLogo} alt="logo" className="h-8 pr-1.5" />
    <span className="pt-1 font-serif leading-none">Linkstr</span>
  </a>
);

const Header = ({
  onPublish = () => {},
  showPublishButton = false,
}: HeaderProps) => {
  return (
    <div className="mt-8 flex items-center justify-between">
      <Logo />
      {showPublishButton && (
        <button className="button h-8 px-3" onClick={onPublish}>
          Publish
        </button>
      )}
    </div>
  );
};

export { Header, Logo };
