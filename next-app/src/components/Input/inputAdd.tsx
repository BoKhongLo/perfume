"use client";
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import type { InputRef } from "antd";
import { GetTagsProduct } from "@/lib/api";

type createTypeDto = {
    type: string;
    value?: string;
};

export const InputAdd: React.FC<{
    typeTag: string;
    value?: string | string[];
    multi?: boolean;
    onChange?: (value: any) => void;  // Controlled onChange from Form.Item
}> = ({ typeTag, multi, value, onChange }) => {
    const [items, setItems] = useState<createTypeDto[]>([]);
    const [name, setName] = useState("");
    const inputRef = useRef<InputRef>(null);

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        if (name) {
            const newItems = [...items, { type: typeTag, value: name }];
            
            setItems(newItems);
            // Gọi hàm onChange để cập nhật giá trị trong Form.Item
            if (onChange) {
                onChange(multi ? [...items.map(i => i.value), name] : name);
            }
            setName("");
            setTimeout(() => { inputRef.current?.focus(); }, 0);
        }
    };

    useEffect(() => {
        GetTagsProduct(typeTag)
            .then((data) => {
                const tagItems = data.map((val) => ({ type: typeTag, value: val.value }));

                setItems(tagItems);
            })
            .catch(() => console.log("error"));
    }, [typeTag]);

    return (
        <Select
            className="w-full"
            placeholder={`Select ${typeTag}`}
            mode={multi ? "multiple" : undefined}
            value={value}
            onChange={(selectedValue) => {
                if (onChange) onChange(selectedValue);  // Gọi hàm onChange của Form.Item khi có thay đổi
            }}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "0 8px 4px" }}>
                        <Input
                            placeholder="Please enter item"
                            ref={inputRef}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            Add
                        </Button>
                    </Space>
                </>
            )}
            options={items.map((item) => ({ label: item.value, value: item.value }))}
        />
    );
};
