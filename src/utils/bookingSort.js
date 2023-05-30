function getDateObject(date){
    return new Date(date[0],date[1]-1,date[2])
}
export function sortByDate(b1, b2){
    const dateA = getDateObject(b1.date);
    const dateB = getDateObject(b2.date);
    if (dateA.getTime()< dateB.getTime()) {
        return -1;
    }
    if (dateA.getTime()> dateB.getTime()) {
        return 1;
    }
    return 0;
}

export function sortByBookedAt(b1, b2){
    if (b1.bookedAt > b2.bookedAt) {
        return -1;
    }
    if (b1.bookedAt < b2.bookedAt) {
        return 1;
    }
    return 0;
}
export function sortByPlace(a, b) {
    const placeA = a.place;
    const placeB = b.place;
    if (placeA.name < placeB.name) {
        return -1;
    }
    if (placeA.name > placeB.name) {
        return 1;
    }
    if (placeA.address < placeB.address) {
        return -1;
    }
    if (placeA.address > placeB.address) {
        return 1;
    }
    return 0;
}
export function sortByStatus(a,b){
    if (a.confirmed && !b.confirmed) return -1;
    if (!a.confirmed && b.confirmed) return 1;
    if (a.rejected && !b.rejected) return -1;
    if (!a.rejected && b.rejected) return 1;
    return 0;
}