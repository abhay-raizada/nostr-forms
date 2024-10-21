import { Button, Typography } from "antd";
import EmptyScreen from "../../components/EmptyScreen";

interface LoggedOutScreenProps {
  requestLogin: () => void;
}

const { Text } = Typography;
export const LoggedOutScreen: React.FC<LoggedOutScreenProps> = ({
  requestLogin,
}) => {
  return (
    <EmptyScreen
      message="You are not logged in, Login to see your past forms"
      action={requestLogin}
      actionLabel="Login"
    />
  );
};
