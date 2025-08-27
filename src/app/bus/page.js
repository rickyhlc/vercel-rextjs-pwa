import { ALL_ZINC } from "@/lib/utils";
import BookmarkList from "./bookmark/bookmarkList";
import Title from "./bookmark/title";
import BottomBar from "./bookmark/bottomBar";

import { DataProvider } from "./bookmark/dataProvider";

export default function BusPage() {

  console.log("BusPage");

  return (
    <div className={`flex flex-col min-h-screen max-h-screen justify-between ${ALL_ZINC}`}>
      <DataProvider>
        <div className="flex p-2 items-center">
          <Title />
        </div>
        <div className="grow-1">
          <BookmarkList />
        </div>
        <div className="flex items-center p-4">
          <BottomBar />
        </div>
      </DataProvider>
    </div>
  );
}