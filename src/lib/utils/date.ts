export function formatMessageDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();

    // Check if it's today
    const isToday = d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

    if (isToday) {
        const hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
        return `${displayHours}:${minutes} ${ampm}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
        return 'Yesterday';
    }

    const diff = now.getTime() - d.getTime();
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dayDiff < 7) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()];
    } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    }
}

export function formatDetailedDate(date: Date | string): string {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${displayHours}:${minutes} ${ampm}`;
}
