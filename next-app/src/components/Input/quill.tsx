import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const Editor: React.FC<{
    typeTag: string;
    value?: any;  // Controlled value from Form.Item
    onChange?: (value: any) => void;  // Controlled onChange from Form.Item
}> = ({typeTag, value, onChange}) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ align: "right" }, { align: "center" }, { align: "justify"}],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            ["link", "image"],
            [{ color: ["rgb(239, 68, 68)", "#785412"] }],
            [{ background: ["rgb(239, 68, 68)", "#785412"] }],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "color",
        "image",
        "background",
        "align",
        "font",
    ];

    const [code, setCode] = useState<string>(value);

    const handleProcedureContentChange = (
        content: string,
        delta: any,
        source: string,
        editor: any
    ) => {
        setCode(content);
        if (onChange) { onChange(content); }
    };

    return (
        <div className="max-w-[600px]">
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={code}
                onChange={handleProcedureContentChange}
            />
        </div>
    );
};
