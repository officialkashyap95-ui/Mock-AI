import { useState } from "react";
import api from "../api/axios";

function Register() {

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const handleSubmit=async(e)=>{
e.preventDefault();

try{

const res=await api.post(
"/auth/register",
{
name,
email,
password
}
);

console.log(res.data);

alert("Registration Successful");

}catch(err){

console.log(err.response?.data);

}

};

return (
<div>

<h1>Register</h1>

<form onSubmit={handleSubmit}>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Name"
/>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"
/>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Password"
/>

<button type="submit">
Register
</button>
</form>

</div>
);

}

export default Register;