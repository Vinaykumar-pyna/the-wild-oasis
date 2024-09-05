import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {getBooking} from "../../services/apiBookings";

export function useBooking() {
    const {bookingId} = useParams();
    const {isLoading, data: booking, error} = useQuery({
        queryKey: ["booking", bookingId], // We include the bookingId here to ensure unique query keys. Without it, switching between booking pages would result in cached data being used for all pages since they'd share the same key. This approach assigns a unique name to each query based on the bookingId.
        queryFn: () => getBooking(bookingId),
        retry: false // Disable retries for this query. By default, React Query retries failed requests 3 times. In this case, a missing booking likely means it doesn't exist, so retries are unnecessary.
    });
    return {isLoading, error, booking};
}