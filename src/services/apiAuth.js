import supabase, {supabaseUrl} from "./supabase";

export async function signup({fullName, email, password}) {
    const {data, error} = await supabase.auth.signUp({
        email, password, options: {
            data: {
                fullName,
                avatar: "",
            }
        }
    });
    if (error)
        throw new Error(error.message);
    return data;
}

export async function login({email, password}) {

    const {data, error} = await supabase.auth.signInWithPassword({ // We use the `auth` sub module of our Supabase client to perform authentication actions. The `signInWithPassword` method is used to sign in a user with their email and password.
        email,
        password
    });
    if (error)
        throw new Error(error.message);
    // console.log(data);
    return data;
}

export async function getCurrentUser() { // This function handles user persistence. In web applications, users expect to remain logged in after page reloads, even days later. To achieve this, we first check for an active session in local storage using getSession. If no session exists, we return null (no user). If a session exists, it refetches the user data from Supabase for better security.
    const {data: session} = await supabase.auth.getSession(); // This will actually get the data from local storage.
    if (!session.session)
        return null;
    const {data, error} = await supabase.auth.getUser();
    // console.log(data);
    if (error)
        throw new Error(error.message);
    return data?.user;
}

export async function logout() {
    const {error} = await supabase.auth.signOut();
    if (error)
        throw new Error(error.message);
}

export async function updateCurrentUser({password, fullName, avatar}) {
    // 1. Update the password OR the fullName
    let updateData;
    if (password)
        updateData = {password};
    if (fullName)
        updateData = {data: {fullName}};
    const {data, error} = await supabase.auth.updateUser(updateData); // This will automatically determine the currently logged-in user, allowing us to update their information. To achieve this, we need to pass an object containing all the data that requires updating.
    if (error)
        throw new Error(error.message);
    if (!avatar)
        return data;
    // 2. Upload the avatar image
    const fileName = `avatar-${data.user.id}=${Math.random()}`;
    const {error: storageError} = await supabase.storage.from("avatars").upload(fileName, avatar); // Here 'avatars' is the name of the bucket.
    if (storageError)
        throw new Error(storageError.message);

    // 3. Update the avatar in the user
    const {data: updatedUser, error: error2} = await supabase.auth.updateUser({
        data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
        }
    });
    if (error2)
        throw new Error(error2.message);
    return updatedUser;
}