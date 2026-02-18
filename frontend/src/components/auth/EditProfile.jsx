import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
      clearError, 
      setError, 
      setLoading,
      setUser,
} from '../../redux/slices/authSlice';
import axios from "axios";
import "../../css/auth/EditProfile.css";
import { CiUser } from 'react-icons/ci';
import Input from '../common/Input';

const EditProfile = ({ onClose }) => {
    const dispatch = useDispatch();
    const {user, token, isLoading, error} = useSelector((state) => state.auth);

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    //Update password
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const [previewImage, setPreviewImage] = useState(user?.avatar || "");
    const [base64Image, setBase64Image] = useState("");

    useEffect(() =>{
        if(user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPreviewImage(user.avatar || "");
        }
    }, [user]);

    //For imagekit => raw image to base64Image

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            setPreviewImage(reader.result);
            setBase64Image(reader.result);
        };
    };

    //Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const payload = {};

        if(name && name !== user.name)payload.name = name;
        if(email && email !== user.email)payload.email = email;
        if (base64Image)payload.avatar = base64Image;

        if(showPasswordFields){
            if(!currentPassword || !newPassword) {
                dispatch(setError("To change Password, both fields are required"));
                return;
            }
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }

        if(Object.keys(payload).length === 0){
            dispatch(setError("Please update atleast one field"));
            return;
        }
        dispatch(setLoading(true));
        const storedToken = token || localStorage.getItem("token");

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
                payload,
                {
                    headers:{
                        Authorization: `Bearer ${storedToken}`,
                    },
                },
            );
            const data = response.data || {};

            dispatch(
                setUser({
                    user: data.user,
                    token: token || localStorage.getItem("token"),
                }),
            );

            if(onClose) {
                dispatch(clearError());
                onClose();
            }
            console.log("Profile updated!");
        } catch (error) {
            let serverMessage =
              error?.response?.data?.message || error?.response?.data?.error;
            dispatch(
                setError(serverMessage || "Profile update failed! Please try again"),
            );
            
        }finally{
            dispatch(setLoading(false));
        }
    };

  return (
    <div className="editprofile-wrapper">
        <h3 className="editprofile-title">Edit Profile</h3>
        <p>Update your account Details</p>

        <form className='editprofile-form' onSubmit={handleSubmit}>
            {!showPasswordFields && (
                <>
                  <div className="profile-image-container">
                    {previewImage ? (<img src={previewImage} alt='profile' className='profile-image'/>) : (
                        <div className="profile-placeholder">
                            <CiUser size={40} />
                        </div>
                    )}

                    <label className='image-upload-icon'>📸
                    <input
                      type='file' 
                      accept='image/*'
                      hidden
                      onChange={handleImageChange} 
                    />    
                    </label>
                  </div>

                  <Input
                    label={"Name"}
                    type={"text"}
                    placeholder={"Update your name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label={"Email"}
                    type={"text"}
                    placeholder={"Update your email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
            )}

            {showPasswordFields && (
                <> 
                  <Input
                    label={"Current Password"}
                    type={"password"}
                    placeholder={"Enter current password"}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                 />
                 <Input
                    label={"New Password"}
                    type={"password"}
                    placeholder={"Enter new password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                 />

                </>
            )}
            {error && <div className='editprofile-error'>{error}</div>}
            <button
              type='button' 
              className='editprofile-password-toggle'
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
                {showPasswordFields ? "Cancel Password Change" : "Change Password"}
            </button>

            <div className="editprofile-actions">
                <button
                  type='button' 
                  className='editprofile-btn-cancel' 
                  onClick={onClose}
                  disabled={isLoading}
                >
                    Cancel
                </button>
                <button type='submit' className='editprofile-btn-submit'>
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    </div>
  )
}

export default EditProfile;