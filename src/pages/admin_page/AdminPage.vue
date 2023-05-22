<template>
	<v-container>
		<v-data-table
				:items="bookings"
				:search="search"
				:loading="loading"
				:rows-per-page-items="[10, 25, 50]"
				:sort-desc="sortDesc"
				:pagination.sync="pagination"
				multi-sort
				hide-default-footer
		>
			<template #top>
				<v-toolbar flat>
					<v-toolbar-title>Admin Panel</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-text-field v-model="search" label="Search"></v-text-field>
				</v-toolbar>
			</template>
			<template #item.actions="{ item }">
				<v-icon
						small
						class="mr-2"
						@click="deleteBooking(item)"
				>
					mdi-delete
				</v-icon>
				<v-icon
						small
						class="mr-2"
						@click="confirmBooking(item)"
				>
					mdi-check
				</v-icon>
				<v-icon
						small
						class="mr-2"
						@click="editBookingDate(item)"
				>
					mdi-calendar-edit
				</v-icon>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
import {getBookings} from "@/api/mainApi";

export default {
    data() {
        return {
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Name', value: 'name' },
                { text: 'Date', value: 'date' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            bookings: [],
            search: '',
            loading: false,
            pagination: {},
            sortBy: 'id',
            sortDesc: false,
        };
    },
    created() {
        // Fetch bookings from the server on component mount
        this.fetchBookings();
    },
    methods: {
        fetchBookings() {
					getBookings()
							.then(data => {
								this.bookings = data;
							});
        },
        deleteBooking(booking) {
            // Make an API request to delete the booking by its ID
            // Update the 'bookings' data property by removing the deleted booking
        },
        confirmBooking(booking) {
            // Make an API request to confirm the booking by its ID
            // Update the 'bookings' data property by marking the booking as confirmed
        },
        editBookingDate(booking) {
            // Show a date picker dialog to select a new date for the booking
            // Make an API request to update the booking date by its ID
            // Update the 'bookings' data property with the updated booking
        },
    },
};
</script>
