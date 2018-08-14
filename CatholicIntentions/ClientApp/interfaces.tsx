export interface PrayersState {
    prayers: Prayer[];
    lastUpdated: string;
    timeRemaining: number;
}

export interface SubmitPrayer {
    prayer: string;
    time: string;
    errors: boolean;
    success: boolean;
    timeout: boolean;
}

export interface Prayer {
    k: string; // key
    p: string; // prayer
    t: string; // time
    r: string; // reviewed
    r_t: string; // reviewed_time
}

export interface ReviewPage {
    authorized: boolean;
    toBeApproved: Prayer[];
}

export interface CustomWindow extends Window {
    FB: any;
    fbAsyncInit: any;
}