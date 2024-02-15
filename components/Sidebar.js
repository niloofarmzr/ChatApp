import React from 'react';
import styled from 'styled-components'
import Avatar from "@material-ui/core/Avatar";
import ChatIcon from "@material-ui/icons/Chat"
import MoreVerticalIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search"
import IconButton from "@material-ui/core/IconButton";
import {Button} from "@material-ui/core";
import * as EmailValidator from "email-validator"
import {auth, db} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar(props) {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt("please enter an email address for the user you wish to chat with");
        if(!input) return null;
        if(EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
            db.collection('chats').add({
                users: [user.email, input],
            })
        }
    };

    const chatAlreadyExists = recipientEmail => !!chatsSnapshot?.docs.find(chat =>
        chat.data().users.find(user => user === recipientEmail).length > 0
    );

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVerticalIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon/>
                <SearchInput placeholder="Search in chats"/>
            </Search>

            <SidebarButton fullWidth onClick={createChat}>
                Start a new chat
            </SidebarButton>


            {chatsSnapshot?.docs?.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))}
        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    height: 100vh;
    overflow-y: scroll;
    min-width: 300px;
    max-width: 350px;
    border-right: 1px solid whitesmoke;
    -ms-overflow-style: none;
    scrollbar-width: none;
    ::-webkit-scrollbar {
        display: none
    }
`;

const SidebarButton = styled(Button)`
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px
`;

const SearchInput = styled.input`
    outline: 0;
    border: none;
    flex: 1
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8
    }
`;

const IconsContainer = styled.div``;