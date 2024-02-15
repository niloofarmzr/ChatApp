import React from "react";
import styled from "styled-components"
import Button from "@material-ui/core/Button";
import {auth, provider} from "../firebase"

function Login() {
    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert)
    };
    return (
        <Container>
            <LogoContainer>
                <Logo src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"/>
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LogoContainer>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: whitesmoke
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
    padding: 100px;
    border-radius: 10px;
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;