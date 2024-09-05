import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../../services/apiAuth";

export function useUser() { // This hook fetches the current user and caches it to avoid unnecessary re-downloads.
    const {isLoading, data: user} = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUser,
    });
    return {isLoading, user, isAuthenticated: user?.role === "authenticated"};
}