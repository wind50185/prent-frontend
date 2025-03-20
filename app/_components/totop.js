"use client";

import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";

export default function Totop() {
  return (
    <>
      <Link href="#Top" className="to_top_btn">
        <IoIosArrowUp />
      </Link>
    </>
  );
}
