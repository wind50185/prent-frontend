"use client"

import LeftList from "../../_components/left_list";
import Article from "../../_components/article";
import { useParams } from "next/navigation";

export default function DiscussPage() {
    const { dis } = useParams();

    return (
    <>
        <div className="container">
            <div className="row">
                <div className="col-2 pe-3">
                    <div className="left_list_fixed">
                        <LeftList />
                    </div>
                </div>
                <div className="col-8">
                    <Article id={dis}/>
                </div>
            </div>
        </div>
    </>
    )
}