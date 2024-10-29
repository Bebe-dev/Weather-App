import Dailyly from "../features/daily";
import Hourly from "../features/hourly";

export default function Forecast() {
    return(
        <div className="flex gap-10">
            <Dailyly/>
            <Hourly/>
        </div>
    )
}