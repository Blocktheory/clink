import React, { FC } from "react";

export interface IprimaryBtn {
    title: string;
}

const PrimaryBtn: FC<IprimaryBtn> = (props) => {
    const { title } = props;
    return (
        <button className="py-4 px-6 btnBg support_text_bold rounded-lg">{title}</button>
    );
};
export default PrimaryBtn;
