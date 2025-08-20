import { ALL_ZINC, getSearchBusURL } from "@/lib/utils";
import BookmarkList from "./bookmarkList";
import NavBtn from "@/components/navBtn";
import SearchIcon from "@/icons/search";

export default function BusPage() {

  console.log("BusPage");

  return (
    <div className={`flex flex-col min-h-screen max-h-screen justify-between ${ALL_ZINC}`}>
      <BookmarkList />
      <div className="flex justify-end p-4">
        <NavBtn path={getSearchBusURL()} iconElm={<SearchIcon className="w-8 h-8 text-inherit" />} />
      </div>
    </div>
  );
}