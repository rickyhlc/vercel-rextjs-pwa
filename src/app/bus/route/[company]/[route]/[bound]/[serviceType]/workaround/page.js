import { Suspense } from "react";
import { CircularProgress } from '@mui/material';
import { ALL_ZINC } from "@/lib/utils";
import { DataProvider } from "@/app/bus/route/dataProvider";
import StopList from "@/app/bus/route/stopList";
import BookmarkDrawer from "@/app/bus/route/bookmarkDrawer";
import Title from "@/app/bus/route/title";

// nothing will be prerendered at BUILD time when generateStaticParams returns empty array
// but it enabled ISR, so each route will need to be rendered once
export async function generateStaticParams() {
  return [];
}

export default function RoutePage({ params }) {

  console.log("RoutePage");

  return (
    <div className={`flex flex-col min-h-screen max-h-screen justify-between ${ALL_ZINC}`}>
      <Suspense fallback={<div className="text-center mt-20"><CircularProgress size={32} /></div>}>
        <DataProvider params={params}>
          <div className={`flex flex-col p-2 items-center justify-center ${ALL_ZINC}`}>
            <Title />
          </div>
          {/* show here map later */}
          <div className="grow-1 basis-0 overflow-y-auto bg-zinc-900">
            <StopList />
          </div>
          <BookmarkDrawer />
        </DataProvider>
      </Suspense>
    </div>
  );
}