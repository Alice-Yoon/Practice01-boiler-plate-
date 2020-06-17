import React, {useState} from 'react'
import axios from 'axios'

function LoginPage() {

    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }
    
    const submitHandler = (e) => {
        e.preventDefault();

        const loginInfo = {
            email: Email,
            password: Password
        }

        axios.post('/api/users/login', loginInfo)
            .then(res => {
                console.log(res.data)
                if(res.data.loginSuccess){

                    window.localStorage.setItem('userId', res.data.userId)
                }
            })
    }


    return (
        <div style={{border: '1px solid black', display: 'flex', justifyContent:'center', alignItems:'center', height:'100vh', width:'100%'}}>
            
            <form 
                onSubmit={submitHandler}
                style={{border:'1px solid black', display:'flex', flexDirection:'column', padding: '2rem'}}
            >

                <label>Email</label>
                <input type='email' placeholder='Enter email..' value={Email} onChange={onChangeEmail} />
                <label>Password</label>
                <input type='password' placeholder='Enter password..' value={Password} onChange={onChangePassword} />
                <br/>
                <button type='submit'>Submit</button>
            </form>

        </div>
    )
}

export default LoginPage
