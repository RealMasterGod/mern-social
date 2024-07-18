import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import {io} from "socket.io-client"
import axios from "axios"

export default function Messenger() {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const socket = useRef()
    const {user} = useContext(AuthContext)
    const scrollRef = useRef()

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage",(data)=>{
            console.log("in get Message")
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
            console.log(arrivalMessage)
        })
    },[arrivalMessage])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages(prev=>[...prev,arrivalMessage])
    }, [arrivalMessage,currentChat])

    useEffect(() => {
        socket.current.emit("addUser",user?._id)
        socket.current.on("getUsers",users=>{
            setOnlineUsers(user?.followings?.filter((f) => users?.some(u => u?.userId === f)))
        })
    },[user])


    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("https://mern-social-api-git-main-realmastergods-projects.vercel.app/api/conversations/"+ user._id)
                setConversations(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getConversations()
    },[user._id])

    useEffect(() => {
        const getMessages = async () => {
           try {
                const res = await axios.get("https://mern-social-api-git-main-realmastergods-projects.vercel.app/api/messages/"+currentChat?._id)
                setMessages(res.data)
           } catch (err) {
                console.log(err)
           }
        }
        getMessages()
    },[currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
            sender: user?._id,
            text: newMessage,
            conversationId: currentChat?._id,
        }

        const recieverId = currentChat.members.find((member)=> member !== user?._id)

        socket.current.emit("sendMessage",{
            senderId: user?._id,
            recieverId,
            text: newMessage,
        })
        

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages,res.data])
            setNewMessage("")
        } catch (err) {
            console.log(err)
        }
    }

  

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"}) 
    },[messages])


    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" placeholder="Search for friends" className="chatMenuInput" />
                        {conversations?.map((c) => (
                            <div key={c._id} onClick={() => setCurrentChat(c)}>
                                <Conversation key={c._id} conversation={c} currentUser={user} />
                            </div>
                        ))}
                        
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                        <>
                        <div className="chatBoxTop">
                            {messages?.map((m) => (
                                <div key={m._id} ref={scrollRef}>
                                    <Message key={m._id} message={m} own={m.sender === user?._id}/>
                                </div>
                            ))}
                        </div>
                        <div className="chatBoxBottom">
                            <textarea placeholder="write something..."  className="chatMessageInput" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} ></textarea>
                            <button className="chatSubmitButton" onClick={handleSubmit} >Send</button>
                        </div> </> : <span className="noConversationText">Open a conversation to start a chat.</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentId={user?._id} setCurrentChat={setCurrentChat}/>
                    </div>
                </div>
            </div>
        </>
    )
}
