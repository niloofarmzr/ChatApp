import React from 'react';
import {useRouter} from "next/router";
import styled from "styled-components"
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import {db, auth} from "../../firebase"
import {useAuthState} from "react-firebase-hooks/auth";

function Chat({chat, messages}) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    return (
        <Container>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    );
}

export default Chat;

export const getServerSideProps = async (context) => {
    const ref = db.collection('chats').doc(context.query.id);
    const messagesRes = await ref.collection('messages').orderBy('timestamp', "asc").get();
    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    };

    return {
        props: {
            messages: JSON.stringify(messages),
            chat
        }
    }
};

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none
    }
`;
