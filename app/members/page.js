"use client"

import List from "./_components/left_list";
import MembersProfile from "./_components/members_profile";

export default function MembersPage() {
    
    return (
    <>
        <div className="container pt-3">
            <div className="row">
                <div className="col-3 left_list_fixed">
                    <List />
                </div>
                <div className="col-9 members_content">
                    <MembersProfile />
                </div>
            </div>
        </div>
    </>
    )
}