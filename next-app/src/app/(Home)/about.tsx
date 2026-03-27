"use client"
import Introduce from './introduce'
import { useState } from 'react'

export default function About() {
    const [isOpenIntroduce, setIsOpenIntroduce] = useState<boolean>(false)

    return (
        <div id="main-introduce" className={`xl:container my-16 pt-8 border-y border-neutral ${isOpenIntroduce ? "" : "h-96 overflow-hidden"} relative`}>
            <div style={{
                height: "100%",
                padding: "20px 20px",
                position: "relative",
                filter: isOpenIntroduce ? "" : "blur(1px)",
                maskImage: isOpenIntroduce ? "" : "linear-gradient(to bottom, white, transparent)"
            }}><Introduce /></div>
            <a href="/#main-introduce"><button className="btn glass absolute rounded-none" style={{
                bottom: 0,
                left: "50%",
                transform: `translate(-50%, ${isOpenIntroduce ? "40px" : "-20px"})`
            }} onClick={() => {
                setIsOpenIntroduce((isOpenIntroduce => !isOpenIntroduce))
            }}>{isOpenIntroduce ? "Thu gọn" : "Đọc thêm"}</button></a>
        </div>
    )
}