import { defineStore } from "pinia";

export const useAboutStore = defineStore('about', {
    state: () => ({
        aboutData: [],
    }),
});
