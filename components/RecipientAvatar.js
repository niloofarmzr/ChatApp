import React from 'react';
import getRecipientEmail from "../utils/getRecipientEmail";
import {useCollection} from "react-firebase-hooks/firestore";
import {db} from "../firebase";
import Avatar from "@material-ui/core/Avatar";

function RecipientAvatar({users, user, ...props}) {
    const recipientEmail = getRecipientEmail(users, user);
    const [recipientSnapshot] = useCollection(db.collection("users").where("email", "==", recipientEmail));
    const recipient = recipientSnapshot?.docs?.[0];
    return (
        recipient ? <Avatar src={recipient.photoURL} {...props}/> : <Avatar {...props}>{recipientEmail[0]}</Avatar>
    );
}

export default RecipientAvatar;