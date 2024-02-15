import React from 'react';

const scrollToBottom = (ref) => {
    ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
};

export default scrollToBottom;