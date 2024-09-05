import {getToday} from "../utils/helpers";
import supabase from "./supabase";
import {PAGE_SIZE} from "../utils/constants";

export async function getBookings({filter, sortBy, page}) {
    // const {data, error} = await supabase.from("bookings").select("*, cabins(*), guests(*)");
    /* `*` in `SELECT *` retrieves all columns from the `bookings` table.
    Commas separate column selections. Here, we're also selecting all columns from nested tables:
    `cabins(*)` selects all columns from the `cabins` table, which is a foreign table referenced by `bookings`.
    `guests(*)` selects all columns from the `guests` table, another foreign table referenced by `bookings`. */
    // const {data, error} = await supabase.from("bookings").select("id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)").eq("status", "unconfirmed").gte("totalPrice", 5000); // This query uses the `eq` method to filter for bookings where the `status` is equal to 'unconfirmed'. The `gte` method filters for bookings with a `totalPrice` greater than or equal to 5000.
    /* const {
        data,
        error
    } = await supabase.from("bookings").select("id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)"); */
    let query = supabase.from("bookings").select("id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, cabins(name), guests(fullName, email)", {count: "exact"}); // This `select` function allows us to pass a second argument, an object with a `count` property. Setting `count` to "exact" tells Supabase to efficiently return only the number of rows matching the query, without fetching the actual data. This is useful when we only need to know how many results there are, not the specific details of each record.

    // FILTER
    if (filter) {
        // query = query.eq(filter.field, filter.value);
        query = query[filter.method || "eq"](filter.field, filter.value); // If no `filter.method` is provided, we default to the `eq` method for equality checks.
    }

    // SORT
    if (sortBy)
        query = query.order(sortBy.field, {ascending: sortBy.direction === "asc"}); // This `order` method sorts the query results. The first argument specifies the field name to sort by. The second argument is an optional object with options. The `ascending` option (boolean) specifies the sort direction: `true` (default) for ascending order (lowest to highest), `false` for descending order (highest to lowest).

    if (page) {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);
        /* We can use the `range` method from Supabase to limit the results returned by the query. This method takes two arguments:
        `from`: This is the zero-based index of the first record we want to include in the results. For example, `from: 10` would start from the 11th record (since indexing starts at 0).
        `to`: This is the zero-based index of the last record we want to include (inclusive). So, `to: 20` would return records from index 10 to 20 (21 records total). */
    }

    const {data, error, count} = await query;
    if (error) {
        console.error(error);
        throw new Error("Bookings could not be loaded");
    }
    return {data, count};
}

export async function getBooking(id) {
    const {data, error} = await supabase
        .from("bookings")
        .select("*, cabins(*), guests(*)")
        .eq("id", id)
        .single(); // Here with 'single()' we grab the single object out of the array.

    if (error) {
        console.error(error);
        throw new Error("Booking not found");
    }

    return data;
}


// The date must be in ISOString format, as that is what Supabase expects here.
export async function getBookingsAfterDate(date) {
    const {data, error} = await supabase
        .from("bookings")
        .select("created_at, totalPrice, extrasPrice")
        .gte("created_at", date)
        .lte("created_at", getToday({end: true}));

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }

    return data;
}

export async function getStaysAfterDate(date) {
    const {data, error} = await supabase
        .from("bookings")
        .select("*, guests(fullName)")
        .gte("startDate", date)
        .lte("startDate", getToday());

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }

    return data;
}

export async function getStaysTodayActivity() {
    const {data, error} = await supabase
        .from("bookings")
        .select("*, guests(fullName, nationality, countryFlag)")
        .or(
            `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
        )
        .order("created_at");

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }
    return data;
}

export async function updateBooking(id, obj) {
    const {data, error} = await supabase
        .from("bookings")
        .update(obj)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking could not be updated");
    }
    return data;
}

export async function deleteBooking(id) {
    const {data, error} = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Booking could not be deleted");
    }
    return data;
}

