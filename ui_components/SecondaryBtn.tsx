import React, { FC } from "react";

export interface ISecondaryBtn {
    title: string;
}

const SecondaryBtn: FC<ISecondaryBtn> = (props) => {
    const { title } = props;
    return (
        <button className="py-4 px-6 btnBg support_text_bold rounded-lg">{title}</button>
    );
};
export default SecondaryBtn;
