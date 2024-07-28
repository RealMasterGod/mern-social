import { Cancel, EmojiEmotions, Label, PermMedia, Room } from "@mui/icons-material"
import "./share.css"
import { useContext, useRef, useState } from "react"
import {AuthContext} from "../../context/AuthContext"
import app from "../../firebase"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios"

export default function Share() {
    const {user} = useContext(AuthContext)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const desc = useRef()
    const [file, setFile] = useState(null)
    const storage = getStorage(app);

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

    const submitHandler = async (e) => {
        e.preventDefault()
        const newPost = {
            userId: user._id,
            desc: desc.current.value
        }
        // if(file) {
        //     // const data = new FormData()
            
        //     // data.append("name",fileName)
        //     // data.append("file",file)
        //     // newPost.img = fileName
        //     // try {
        //     //     await axios.post(`${process.env.REACT_APP_BASE_URL}upload`, data)
        //     // } catch (err) {
        //     //     console.log(err)
        //     // }
        // }

        try {
           if(file) {
               newPost.img = await upload()       
           }
           await axios.post(`${process.env.REACT_APP_BASE_URL}posts`,newPost)
           window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.png"} alt="" className="shareProfileImg" />
                    <input placeholder={"What's in your mind "+user.username+ "?"} ref={desc} className="shareInput" />
                </div>
                <hr className="shareHr" />
                {file && (
                    <div className="shareImgContainer">
                        <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                        <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler}>
                    <label htmlFor="file" className="shareOptions">
                        <div className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon"/>
                            <span className="shareOptionText">Photo or Video</span>
                            <input style={{display: 'none'}} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </label>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    )
}
