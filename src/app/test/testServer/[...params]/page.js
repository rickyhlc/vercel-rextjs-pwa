

export const dynamicParams = false

export async function generateStaticParams() {
  console.log("~~~generateStaticParams2");
  return [{ params: ['1','2']},{ params: ['a']}];
}

export default function ParamsPage({  }) {

  console.log("~~~ParamsPage server component");

  return (<div>
    <div>dynamicParams = false</div>
    <div>generateStaticParams2 [1,2] or [a]</div>
  </div>);
}
