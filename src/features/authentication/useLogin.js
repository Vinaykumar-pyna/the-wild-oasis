import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login as loginApi} from "../../services/apiAuth";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {mutate: login, isLoading} = useMutation({
        mutationFn: ({email, password}) => loginApi({email, password}),
        onSuccess: (user) => {
            // console.log(user);
            queryClient.setQueryData(['user'], user.user); // This allows us to manually set some data into the React Query cache.
            navigate('/dashboard', {replace: true});
        },
        onError: err => {
            console.log("ERROR", err);
            toast.error("Provided email or password are incorrect");
        }
    });
    return {login, isLoading};
}