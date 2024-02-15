import React, {useRef, useState} from 'react';
import styled from 'styled-components'
import {db, auth} from "../firebase"
import firebase from "firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRouter} from "next/router";
import Avatar from "@material-ui/core/Avatar";
import MoreVerticalIcon from "@material-ui/icons/MoreVert"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import IconButton from "@material-ui/core/IconButton";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import {useCollection} from "react-firebase-hooks/firestore";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import RecipientAvatar from "./RecipientAvatar";
import TimeAgo from "timeago-react";
import scrollToBottom from "../utils/scrollToBottom";

function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [messagesSnapshot] = useCollection(db.collection("chats").doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'));
    const [input, setInput] = useState('');
    const recipientEmail = getRecipientEmail(chat.users, user);
    const [recipientSnapshot] = useCollection(db.collection("users").where("email", "==", recipientEmail));
    const endOfMessagesRef = useRef();

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message key={message.id} user={message.data().user}
                         message={{...message.data(), timestamp: message.data().timestamp?.toDate().getTime()}}/>
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message}/>
            ))
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        //update last seen
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});

        db.collection("chats").doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });
        setInput('');
        scrollToBottom(endOfMessagesRef)
    };
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    return (
        <Container>
            <Header>
                <RecipientAvatar users={chat.users} user={user}/>
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                            Last active: {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                        ) : 'unavailable'}
                        </p>
                    ) : 'no snapshot'}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton><AttachFileIcon/></IconButton>
                    <IconButton><MoreVerticalIcon/></IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={e => setInput(e.target.value)} type="text"/>
                <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
                <MicIcon/>
            </InputContainer>
        </Container>
    );
}

const Container = styled.div`

`;

const Header = styled.div`
    display: flex;
    align-items: center;
    position: sticky;
    background: white;
    z-index: 100;
    top: 0;
    padding: 11px;
    border-bottom: 1px solid whitesmoke
    
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    > h3 {
        margin-bottom: 3px;
    }    
    
    > p {
        margin-top: 0;
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
    padding: 30px;
    background: #e5ded8;
    min-height: 90vh
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 100;
`;

const Input = styled.input`
     flex: 1;
     outline: 0;
     border: none;
     border-radius: 10px;
     background: whitesmoke;
     padding: 20px;
     margin-left: 15px;
     margin-right: 15px;
`;

export default ChatScreen;