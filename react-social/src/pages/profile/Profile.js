import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { profileUpdate } from "../../context/AuthActions";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user: currentUser,dispatch} = useContext(AuthContext)
  const [user, setUser] = useState({});
  const username = useParams().username;
  const [update, setUpdate] = useState(false);
  const [newUsername,setNewUsername] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [password, setPassword] = useState("")
  const [desc,setDesc] = useState("")
  const [city,setCity] = useState("")
  const [from,setFrom] = useState("")
  const [relationship,setRelationship] = useState("")
  const [profilePicture,setProfilePicture] = useState(null)
  const [coverPicture,setCoverPicture] = useState(null)
  const [next, setNext] = useState(false);
  const [error,setError] = useState(false);
  const storage = getStorage(app);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}users?username=${username}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [username]);
  const upload = (file) => {
    const fileName =  Date.now()+file.name
    return new Promise((resolve,reject) => {
        const storageRef = ref(storage,'userImages/'+fileName)
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
  const handleUpdate = async (e) => {
    e.preventDefault()
    const updatedUser = {
        userId: user._id,
        password: password,
        ...newUsername? {username: newUsername} : {},
        ...newPassword ? {newPassword} : {},
        ...desc ? {desc} : {},
        ...city ? {city} : {},
        ...from ? {from} : {},
        ...relationship ? {relationship} : {},
    }
    try {
        if(profilePicture) {
            updatedUser.profilePicture = await upload(profilePicture)
        }
        if(coverPicture) {
            updatedUser.coverPicture = await upload(coverPicture)
        }
        const res = await axios.put(`${process.env.REACT_APP_BASE_URL}users/`+ currentUser._id, updatedUser)
        dispatch(profileUpdate(res.data))
        const name = newUsername ? newUsername : user.username
        navigate('/profile/'+name)
        window.location.reload()
    } catch (err) {
        setError(true)
        setNext(false)
        console.log(err)
    }
  };

  if (update) {
    return (
      <>
        <Topbar />
        <div className="profile">
          <Sidebar />
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  src={
                    user.coverPicture
                      ? user.coverPicture
                      : PF + "person/noCover.png"
                  }
                  alt=""
                  className="profileCoverImg"
                />
                <img
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="profileUserImg"
                />
              </div>
              <div className="profileInfo">
                <div className="user-desc">
                  <h4 className="profileInfoName">{user.username}</h4>
                  <span className="profileInfoDesc">{user.desc} </span>
                </div>
              </div>
            </div>
            <h5>
              Update your account information below{" "}
              <b style={{ color: "red" }}>
                (leave empty whatever field you don't want to update)
              </b>
            </h5>
            <form className="update-form" onSubmit={handleUpdate}>
              {!next ? (
                <>
                  <label>Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder={user.username}
                    onChange={e => setNewUsername(e.target.value)}
                  />
                  <label>Description</label>
                  <input
                    name="desc"
                    type="text"
                    placeholder={user.desc || "description"}
                    onChange={e => setDesc(e.target.value)}
                  />
                  <label>New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    placeholder="enter new password"
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <label>City</label>
                  <input onChange={e => setCity(e.target.value)} type="text" placeholder={user.city || "city"} />
                  <label>From</label>
                  <input onChange={e => setFrom(e.target.value)} type="text" placeholder={user.from || "from"} />
                  <label>Relationship</label>
                  <input
                    type="text"
                    placeholder={user.relationship || "relationship status"}
                    onChange={e => setRelationship(e.target.value)}
                  />
                  <label>Profile Picture</label>
                  {profilePicture && <img src={URL.createObjectURL(profilePicture)} style={{height: '30px', width: '30px', borderRadius: '50%', objectFit: 'cover'}} />}
                  <input onChange={e => setProfilePicture(e.target.files[0])} type="file" />
                  <label>Cover Picture</label>
                  {coverPicture && <img src={URL.createObjectURL(coverPicture)} style={{height: '100px', width: '100px', objectFit: 'cover'}} />}
                  <input onChange={e => setCoverPicture(e.target.files[0])} type="file" />
                  <button type="button" onClick={() => setNext(true)}>
                    Next
                  </button>
                  {error && <span style={{color: 'red', marginTop: '5px', fontSize:'12px'}}>Something went wrong...Make sure the password you entered is correct and/or your username is unique</span>}
                </>
              ) : (
                <>
                  <label>Enter Your Current Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="enter current password"
                    onChange={e => {setPassword(e.target.value)}}
                  />
                  <button style={{marginTop: '10px'}} type="submit" onClick={handleUpdate}>
                    Submit
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user.coverPicture
                    ? user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
                className="profileCoverImg"
              />
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="profileUserImg"
              />
            </div>
            <div className="profileInfo">
              <div className="user-desc">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc} </span>
              </div>
              {user.username === currentUser.username && <div className="updateProfile" onClick={() => setUpdate(true)}>
                Update
              </div>}
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
