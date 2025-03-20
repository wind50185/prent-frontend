"use client"

import List from "../_components/left_list";
import RightList from "../_components/right_list";
import StoreListCard from "@/app/store/_components/store_list_card";
import ServiceProCard from "@/app/service/_components/service_pro_card";

const store = [
    {
        id: 1,
        src:"/store_images/list_table.webp",
    },
    {
        id: 2,
        src:"/store_images/list_table.webp",
    },
    {
        id: 3,
        src:"/store_images/list_table.webp",
    },
    {
        id: 4,
        src:"/store_images/list_table.webp",
    },
    {
        id: 5,
        src:"/store_images/list_table.webp",
    },
    {
        id: 6,
        src:"/store_images/list_table.webp",
    },

]

const services = [
    {
      id: 1,
      src: "/service_images/move_01.jpg",
    },
    {
      id: 2,
      src: "/service_images/move_02.jpg",
    },
    {
      id: 3,
      src: "/service_images/move_03.jpg",
    },
    {
      id: 4,
      src: "/service_images/move_04.jpg",
    },
    {
      id: 5,
      src: "/service_images/move_05.jpg",
    },
    {
      id: 6,
      src: "/service_images/move_06.jpg",
    },
  ];

export default function CollectPage() {
    return (
    <>
        <div className="container pt-3">
            <div className="row">
                <div className="col-2 left_list_fixed">
                    <List />
                </div>
                <div className="col-8 members_content px-5">
                    <RightList />
                </div>
            </div>
        </div>
    </>
    )
}