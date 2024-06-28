export interface NavigationItem {
    id: string;
    title: string;
    type: 'item' | 'group' | 'collapsable';
    icon?: string;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    openInNewTab?: boolean;
    children?: NavigationItem[];
}

export interface Navigation extends NavigationItem {
    children?: NavigationItem[];
}
