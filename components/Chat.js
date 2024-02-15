import React from 'react'
import styled from 'styled-components'
import getRecipientEmail from "../utils/getRecipientEmail";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase"
import {useRouter} from "next/router";
import RecipientAvatar from "./RecipientAvatar";

function Chat({id, users}) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, user);

    const enterChat = () => {
        router.push(`/chat/${id}`)
    };

    return (
        <Container onClick={enterChat}>
            <UserAvatar>
                <RecipientAvatar users={users} user={user}/>
            </UserAvatar>

            <p>{recipientEmail}</p>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    
   :hover {
        background-color: #e9eaeb 
   }
`;
const UserAvatar = styled.div`
    margin: 5px;
    margin-right: 15px;
`;

export default Chat;