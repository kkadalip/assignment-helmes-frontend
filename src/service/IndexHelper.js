export function getVisitors(value) {
    if (value === undefined) {
        return [];
    }
    return value.visitors;
}