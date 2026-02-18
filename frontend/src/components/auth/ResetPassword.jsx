import React,{useState} from "react";
import axios from "axios";
import "../../css/auth/ResetPassword.css";
import Input from "../common/Input";
import { useNavigate, useParams } from "react-router-dom";
import { FaListAlt } from "react-icons/fa";

const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate();
    const [password, setPassword] =useState("");
    const [status,setStatus] =useState("");//success |
    
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRest = async () => {
        if(!password || password.length < 6) {
            setStatus("error")
            setMessage("Password must be atleast 6 character");
            return;
        }
        try {
            setLoading(true);
            setStatus("info");
            setMessage("Reseting Password");

            await axios.post(
                `${import.meta.env.VIT_BASE_URL}/api/auth/reset-password/${token}`,
                {password},
            );
            setStatus("success");
            setMessage("Password reset successfully!ReDirecting...");

            setTimeout(() => navigate("/"), 2000);


        } catch (error) {
            setStatus("error")
            setMessage(error?.response?.data?.message || "Reset failed. Try again");
            
        }finally {
            setLoading(false);
        }
    };
  return (
    <div className="reset-wrapper">
        <h3 className="reset-title">Reset Password</h3>
        <p className="reset-subtitle">Enter your new password to regain access</p>

        <div className="reset-form">
            <Input
               label="New Password"
               type="password"
               placeholder="Enter new password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               
            />

            {status === "error" && <div 
            className="reset-error">{message}</div>}
            {status === "success" && <div
            className="reset-success">{message}</div>}

            <button 
               className="reset-submit-btn" 
               onClick={handleReset}
               disabled={loading}
            >
                <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>
        </div>
    </div>
  )
}

export default ResetPassword;