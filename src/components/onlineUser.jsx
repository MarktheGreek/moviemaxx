import { useOnlineUsers } from "../hooks/useOnlineUsers";

const OnlineUsers = () => {
  const online = useOnlineUsers();
  return <div>🟢 {online} users online</div>;
};

export default OnlineUsers;
