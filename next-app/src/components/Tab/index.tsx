"use client"
import { ReactNode } from "react"

export default function TabContent() {
    return (
        <div role="tablist" className="tabs tabs-lifted">
            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 1" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                <div></div>
            </div>

            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 2" defaultChecked />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                <div></div>
            </div>
        </div>
    )
}