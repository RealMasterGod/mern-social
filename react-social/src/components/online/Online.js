import { useEffect, useState } from "react";
import "./online.css"
import axios from "axios";

export default function Online({currentUser, onlineUsers}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [friends,setFriends] = useState([])


    useEffect(() => {
        const getFriends = async () => {
          const res = await axios.get("/users/friends/" + currentUser?._id);
          setFriends(res.data);
        };
        getFriends();
      }, [currentUser]);

    useEffect(() => {
        setOnlineFriends(friends?.filter((f) => onlineUsers?.includes(f?._id)));
      }, [onlineUsers, friends]);

    return (
        <>
        {onlineFriends?.map((o) => (
            <li key={o?._id} className="rightbarFriend">
            <div className="rightbarProfileImgContainer">
                <img src={ o?.profilePicture ? PF + o.profilePicture : PF + "person/noAvatar.png"} alt="" className="rightbarProfileImg" />
                <span className="rightbarOnline"></span>
            </div>
            <span className="rightbarUsername">{o?.username}</span>
        </li>
        ))}
        </>
    )
}
