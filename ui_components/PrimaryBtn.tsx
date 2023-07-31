import React, { FC } from "react";

interface IPrimaryBtn {
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PrimaryBtn(props: IPrimaryBtn) {
    const { title, onClick } = props;
    return (
        <button
            className="py-4 px-6 btnBg support_text_bold rounded-lg"
            onClick={onClick}
        >
            {title}
        </button>
    );
}
