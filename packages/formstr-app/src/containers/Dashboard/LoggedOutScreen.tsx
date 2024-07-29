import { Button, Typography } from "antd";

interface LoggedOutScreenProps {
  requestLogin: () => void
}

const { Text } = Typography;
export const LoggedOutScreen: React.FC<LoggedOutScreenProps> = ({ requestLogin }) => {
  return (
    <>
      <Text>You are logged out, login to view your forms on nostr</Text> 
      <Button onClick={requestLogin}>Login</Button>
    </>
  );
};
