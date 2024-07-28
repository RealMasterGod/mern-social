import "./rightbar.css"
import {Users} from "../../dummyData"
import Online from "../online/Online"
import {  useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Add, Remove } from "@mui/icons-material"
import {io} from "socket.io-client"

export default function Rightbar({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [friends,setFriends] = useState([])
    const {user: currentUser, dispatch} = useContext(AuthContext)
    const [followed, setFollowed] = useState(currentUser?.followings?.includes(user?._id))
    const [onlineUsers, setOnlineUsers] = useState([])
    const socket = useRef()

    // useEffect(() => {
    //     socket.current = io("ws://localhost:8900")
    // },[])
    // useEffect(() => {
    //     setFollowed(currentUser.followings.includes(user?.id))
    // },[currentUser,user.id])

    useEffect(() => {
        setFollowed(currentUser?.followings?.includes(user?._id))
        const getFriends = async () => {
            try {
                const friendList = await axios.get(`${process.env.REACT_APP_BASE_URL}users/friends/`+ user?._id)
                setFriends(friendList.data)
            } catch (err) {
                console.log(err)
            }
        }
        getFriends()
    },[user])

    //   useEffect(() => {
    //     socket.current.emit("addUser",currentUser?._id)
    //     socket.current.on("getUsers",users=>{
    //         setOnlineUsers(currentUser?.followings?.filter((f) => users?.some(u => u?.userId === f)))
    //     })
    // },[user,currentUser])



    const handleClick = async() => {
        try {
            if(followed) {
                await axios.put(`${process.env.REACT_APP_BASE_URL}users/`+user._id+"/unfollow",{userId: currentUser._id})
                dispatch({type: "UNFOLLOW", payload: user._id})
            }
            else {
                await axios.put(`${process.env.REACT_APP_BASE_URL}users/`+user._id+"/follow",{userId: currentUser._id})
                dispatch({type: "FOLLOW", payload: user._id})
            }
           
        } catch (err) {
            console.log(err)
        }
        setFollowed(!followed)
    }

    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img src="/assets/gift.png" alt="" className="birthdayImg" />
                    <span className="birthdayText"><b>John Cena </b> and <b>3 other friends</b> have birthday today</span>
                </div>
                <img src="/assets/ad.png" alt="" className="rightbarAd" />
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    <Online  currentUser={currentUser} onlineUsers={onlineUsers}/>
                </ul>
            </>
        )
    }

    const ProfileRightbar = () => {
        
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightbarTitle">User Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User Friends</h4>
                <div className="rightbarFollowings">
                {friends?.map((friend)=>(
                        <Link key={friend?._id} to={"/profile/"+ friend.username} style={{textDecoration: 'none'}}>
                            <div className="rightbarFollowing">
                                <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
                                <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </>

        )
    }

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}
