import { Delete, Edit, MoreVert } from "@mui/icons-material"
import { useState,useEffect, useContext } from "react"
import "./post.css"
import axios from "axios"
import {format} from "timeago.js"
import {Link, useNavigate} from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import app from "../../firebase"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export default function Post({post}) {
    const [like,setLike] =  useState(post.likes.length)
    const [isLiked,setIsLiked] =  useState(false)
    const [user,setUser] =  useState({})
    const [file,setFile] = useState(null)
    const [desc,setDesc] = useState(post.desc)
    const [editMode,setEditMode] = useState(false)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const {user: currentUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const storage = getStorage(app);

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser?._id)) 
    },[currentUser,post.likes])

    useEffect(() => {
        
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}users?userId=${post.userId}`)
                setUser(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUser()
    },[post.userId])

    const upload = () => {
        const fileName =  Date.now()+file.name
        return new Promise((resolve,reject) => {
            const storageRef = ref(storage,'postImages/'+fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                    console.log('Upload is paused');
                    break;
                    case 'running':
                    console.log('Upload is running');
                    break;
                }
                }, 
                (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        reject(error)
                        break;
                        case 'storage/canceled':
                        // User canceled the upload
                        reject(error)
                        break;
                
                        // ...
                
                        case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        reject(error)
                        break;
                    }
                }, 
                () => {
                // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL)
                    });
                }
            )
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const updatedPost = {
            userId: currentUser._id,
            desc: desc,
        }
        try {
            if(file) {
                updatedPost.img = await upload()
            }
            const res = await axios.put(`${process.env.REACT_APP_BASE_URL}posts/${post._id}`, updatedPost)
            setEditMode(false)
            setFile(null)
            navigate(0)
        } catch (err) {
            setEditMode(false)
            setFile(null)
            console.log(err)
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}posts/${post._id}`,{data: {userId:currentUser._id}})
            navigate(0)
        } catch (err) {

        }
    }

    const likeHandler = () => {
        try {
            axios.put(`${process.env.REACT_APP_BASE_URL}posts/`+ post._id+"/like", {userId:currentUser._id})
        } catch (err) {

        }
        setLike(isLiked ? like-1 : like+1)
        setIsLiked(!isLiked)
    }

    return (
        <div className="post">
           <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <Link to={`/profile/${user.username}`}>
                        <img src={ user.profilePicture ? user.profilePicture : PF+"person/noAvatar.png"} alt="" className="postProfileImg" />
                    </Link>
                <span className="postUsername">{user.username}</span>
                <span className="postDate">{format(post.updatedAt)}</span>
                </div>
                {user._id === currentUser._id ? (<div className="postTopRight">
                    {!editMode ? (<button onClick={(e) => {e.preventDefault();setEditMode(true)}} className="editPost" style={{marginRight: '5px',color: 'rebeccapurple'}}>
                        <Edit fontSize='inherit'/>
                    </button>): (
                    <button onClick={handleSubmit} style={{cursor: 'pointer',padding: '5px',border: 'none',marginRight: '5px',backgroundColor: 'rebeccapurple', color: 'white'}}>
                        Submit
                    </button>
                    )}
                    <button onClick={handleDelete} className="deletePost" style={{color: 'red'}}>
                        <Delete fontSize='inherit'/>
                    </button>
                </div>) : (
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                )}
            </div>
            <div className="postCenter">
                {!editMode ? <span className="postText">{post?.desc}</span> : <textarea type="text" style={{width: '100%'}} rows={5} value={desc} onChange={e => setDesc(e.target.value)} />}
                {!file && <img src={post?.img} alt="" className="postImg" />}
                {file && <img src={URL.createObjectURL(file)} className="postImg"/>}
                {editMode && <input type="file" onChange={e => setFile(e.target.files[0])} />}
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img src={`${PF}like.png`} alt="" className="likeIcon" onClick={likeHandler} />
                    <img src={`${PF}heart.png`} alt="" className="likeIcon" onClick={likeHandler} />
                    <span className="likeCounter">{like} people liked it</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment} comments</span>
                </div>
            </div>
           </div>
        </div>
    )
}
