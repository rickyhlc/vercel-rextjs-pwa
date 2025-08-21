import { Suspense } from "react";
import { CircularProgress } from '@mui/material';
import { ALL_ZINC } from "@/lib/utils";
import { DataProvider } from "./dataProvider";
import RouteList from "./routeList";
import NumPad from "./numPad";
import Title from "./title";
import TestItem from "@/app/test/testItem";

export default function SearchPage() {

  console.log("SearchPage");

  return (
    <div className={`flex flex-col min-h-screen max-h-screen justify-between ${ALL_ZINC}`}>
      <Suspense fallback={<div className="text-center mt-20"><CircularProgress size={32} /></div>}>
        <DataProvider>
          <TestItem />{/* for testing only, this will be still a server component and statically prerendered */}
          <div className={`flex p-2 items-center ${ALL_ZINC}`}>
            <Title />
          </div>
          <div className="grow-1 basis-0 overflow-y-auto bg-zinc-900">
            <Suspense fallback={<div className="text-center mt-20"><CircularProgress size={32} /></div>}>
              <RouteList />
            </Suspense>
          </div>
          <NumPad />
        </DataProvider>
      </Suspense>
    </div>
  );
}