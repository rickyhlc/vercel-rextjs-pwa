import ToggleView from './toggleView';
import WebContent from "./web";
import MobileContent from "./mobile";


export default function PortfolioPage() {

  return (
    <div className="flex flex-col min-h-screen max-h-screen p-8 overflow-y-auto">
      <ToggleView webComponent={<WebContent/>} mobileComponent={<MobileContent/>} />
    </div>
  );
}