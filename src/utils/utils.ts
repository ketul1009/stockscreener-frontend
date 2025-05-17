export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const roundToPlaces = (num: number, places: number = 2) => {
    return Math.round(num * 10 ** places) / 10 ** places;
}


