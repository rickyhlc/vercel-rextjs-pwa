

export async function generateStaticParams() {
  console.log("~~~generateStaticParams2");
  return [{ param: "x"}, { param: "a"}];
}

export default function ParamsPage({ params }) {

  console.log("~~~ParamsPage server component", params);

  return (<div>
    <div>generateStaticParams x or a</div>
  </div>);
}
