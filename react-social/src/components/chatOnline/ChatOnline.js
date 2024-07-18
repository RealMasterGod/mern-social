import { useEffect, useState } from "react";
import "./chatOnline.css";
import axios from "axios";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("https://mern-social-api-git-main-realmastergods-projects.vercel.app/users/friends/" + currentId);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);
  useEffect(() => {
    setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f?._id)));
  }, [onlineUsers, friends]);

  const handleClick = async (user) => {
    try {
        const res = await axios.get(`https://mern-social-api-git-main-realmastergods-projects.vercel.app/api/conversations/find/${currentId}/${user?._id}`)
        setCurrentChat(res.data)
    } catch(err) {
        console.log(err)
    }
  }

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="chatOnline">
      {onlineFriends?.map((o) => (
        <div key={o?._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={ o?.profilePicture ? PF + o.profilePicture : PF + "person/noAvatar.png"} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <div className="chatOnlineName">{o?.username}</div>
        </div>
      ))}
    </div>
  );
}
