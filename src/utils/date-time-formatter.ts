export const formatDateTime = (dateTime?: Date | string): string => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
