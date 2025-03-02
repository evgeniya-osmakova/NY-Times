export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day=('0' + date.getDate()).slice(-2);
    const month=('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

export const formatArticleDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return `${formattedDate}, ${formattedTime}`;
};

export const getPrevMonth = (year: number, month: number): { year: number; month: number } => {
    if (month === 1) {
        return {
            year: year - 1,
            month: 12
        };
    }
    return {
        year,
        month: month - 1
    };
};
