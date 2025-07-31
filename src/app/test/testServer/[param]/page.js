

export async function generateStaticParams() {
  console.log("~~~generateStaticParams2");
  return [{ param: "x"}, { param: "a"}];
}

//ISR test
export default function ParamsPage({ params }) {

  console.log("~~~ParamsPage server component");

  return (<div>
    <div>generateStaticParams x or a (SSG)</div>
    <div>ISR for other param</div>
  </div>);
}
