import TestItem from "@/app/test/testItem";
import TestClientItem from "@/app/test/testClientItem";

export async function generateStaticParams() {
  console.log("~~~TestServerPage1 generateStaticParams prerender /x and /a");
  return [{ param: "x"}, { param: "a"}];
}

//ISR test
export default function ParamsPage({ params }) {

  console.log("~~~TestServerPage1 (log at BUILD for x or a, SERVER for other)", params.param);

  return (<div>
    <div>generateStaticParams x or a (SSG)</div>
    <div>ISR for other param</div>
   <TestClientItem />
   <TestItem />

  </div>);
}
