// src/app/actions/get-bookings.ts
import { Booking } from "@/app/types";
import { API_ENDPOINTS } from "@/config/constants";

export const getBookings = async (authToken?: string, userId?: string, userEmail?: string): Promise<Booking[]> => {
    try {
        console.log('Fetching bookings...');
        console.log('Auth token provided:', authToken ? 'Yes' : 'No');
        console.log('User ID provided:', userId ? 'Yes' : 'No');
        console.log('Token preview:', authToken ? `${authToken.substring(0, 20)}...` : 'No token');
        
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        
        // Add authorization header if token is available
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
            console.log('Authorization header set');
        } else {
            console.log('No auth token, making unauthenticated request');
        }
        
        // Build URL with user ID and/or email query parameters if provided
        let url = API_ENDPOINTS.BOOKINGS;
        const params: string[] = [];
        if (userId) {
            params.push(`userId=${encodeURIComponent(userId)}`);
            console.log('Requesting bookings for user:', userId);
        }
        if (userEmail) {
            params.push(`email=${encodeURIComponent(userEmail)}`);
            console.log('Including user email in query:', userEmail);
        }
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        
        const res = await fetch(url, {
            method: 'GET',
            headers,
        });
        
        if (!res.ok) {
            throw new Error(`Failed to fetch bookings: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Bookings fetched successfully:', data.length, 'items');
        
        // If backend doesn't filter by user, filter on frontend as fallback
        if (userId && data.length > 0) {
            console.log('Available user IDs in bookings:', data.map((booking: Booking) => booking.userId));
            console.log('Looking for user ID:', userId);
            
            let filteredData = data.filter((booking: Booking) => booking.userId === userId);
            console.log('Filtered bookings for user:', filteredData.length, 'items');
            
            if (filteredData.length === 0) {
                console.log('No bookings found for user. Available user IDs:', [...new Set(data.map((booking: Booking) => booking.userId))]);
                
                // Try alternative matching - check if any booking has matching email
                if (userEmail) {
                    console.log('Trying alternative matching by email:', userEmail);
                    filteredData = data.filter((booking: Booking) => booking.customerEmail === userEmail);
                    console.log('Filtered bookings by email:', filteredData.length, 'items');
                }
            }
            
            return filteredData;
        }
        
        return data;
    } catch (error) {
        console.error('Error in getBookings:', error);
        throw error;
    }
};

export default getBookings;