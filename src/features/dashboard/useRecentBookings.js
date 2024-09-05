import {useSearchParams} from "react-router-dom";
import {subDays} from "date-fns";
import {useQuery} from "@tanstack/react-query";
import {getBookingsAfterDate} from "../../services/apiBookings";

export function useRecentBookings() {
    const [searchParams] = useSearchParams();
    const numDays = !searchParams.get("last") ? 7 : Number(searchParams.get("last"));
    const queryDate = subDays(new Date(), numDays).toISOString(); // This `subDays` function calculates a date in the past by subtracting a specified number of days from the current date. The first argument is the current date, and the second argument is the number of days to subtract.
    const {isLoading, data: bookings} = useQuery({
        queryFn: () => getBookingsAfterDate(queryDate),
        queryKey: ["bookings", `last-${numDays}`],
    });
    return {isLoading, bookings};
}