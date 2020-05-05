
export class BlogSetting {
    public title: string;
    public footer: string;
}

export class BlogPost {
    public id: number;
    public title: string;
    public createdat: string;  
}

export class BlogCollectionSet {
    public name: string;
    public posts: BlogPost[] = [];
}
export class BlogDateSet {
    public postdate: string;
    public posts: BlogPost[] = [];
}
