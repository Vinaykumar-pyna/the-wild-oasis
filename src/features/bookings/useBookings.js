import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBookings} from "../../services/apiBookings";
import {useSearchParams} from "react-router-dom";
import {PAGE_SIZE} from "../../utils/constants";

export function useBookings() {
    const queryClient = useQueryClient(); // To get the queryClient, we need to use the useQueryClient hook.
    const [searchParams] = useSearchParams();

    // FILTER
    const filterValue = searchParams.get("status");
    const filter = !filterValue || filterValue === "all" ? null : {field: "status", value: filterValue}; // If there is no filterValue, or if the filterValue is "all", then we don't want to apply any filter. In this case, the filter will be null. Otherwise, it will be an object containing a field, which will be "status", and a corresponding "value".
    // const filter = !filterValue || filterValue === "all" ? null : {field: "totalPrice", value: 5000, method: "gte"};

    // SORT
    const sortByRaw = searchParams.get('sortBy') || "startDate-desc";
    const [field, direction] = sortByRaw.split('-');
    const sortBy = {field, direction};

    // PAGINATION
    const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

    // QUERY
    const {isLoading, data: {data: bookings, count} = {}, error} = useQuery({
        // queryKey: ["bookings", filter], // The `queryKey` defines a unique identifier for this query. If the `filter` value changes, the `queryKey` also changes, triggering React Query to refetch the data. This behaves similarly to the dependency array of the `useEffect` hook.
        queryKey: ["bookings", filter, sortBy, page],
        queryFn: () => getBookings({filter, sortBy, page}),
    });

    // PRE-FETCHING
    // Prefetching involves fetching data that we anticipate will be needed soon, before it's actually required to render it on the user interface. In the context of pagination, this typically means fetching the next page of data before the user scrolls down to see it.
    // React Query's infinite queries provide an alternative to traditional pagination with prefetching for implementing infinite scroll functionality.
    const pageCount = Math.ceil(count / PAGE_SIZE);
    if (page < pageCount) {
        queryClient.prefetchQuery({ // The way this prefetchQuery works is exactly the same as the useQuery hook itself. Therefore, we need a query key and a query function inside an object.
            queryKey: ["bookings", filter, sortBy, page + 1],
            queryFn: () => getBookings({filter, sortBy, page: page + 1}),
        });
    }
    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page - 1],
            queryFn: () => getBookings({filter, sortBy, page: page - 1}),
        });
    }
    return {isLoading, error, bookings, count};
}
