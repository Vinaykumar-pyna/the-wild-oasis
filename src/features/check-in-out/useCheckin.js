import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateBooking} from "../../services/apiBookings";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {mutate: checkin, isLoading: isCheckingIn} = useMutation({
        mutationFn: ({bookingId, breakfast}) => updateBooking(bookingId, {
            status: "checked-in",
            isPaid: true,
            ...breakfast,
        }),
        onSuccess: (data) => { // This data argument within the onSuccess handler is not the data returned directly from the updateBooking function. Instead, it's the response data returned by the mutation itself, which include the updated booking information.
            toast.success(`Booking #${data.id} successfully checked in`);
            queryClient.invalidateQueries({active: true}); // This line invalidates all currently active queries on the page. This ensures that any components relying on those queries will refetch the latest data after the booking is checked in.
            navigate("/");
        },
        onError: () => toast.error("There was an error while checking in"),
    });
    return {checkin, isCheckingIn};
}