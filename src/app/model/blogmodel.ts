import * as moment from 'moment';

/**
 * Setting
 */
export class BlogSetting {
    public title: string;
    public footer: string;
    public author: string;
    public authordesp: string;
    public authorimg: string;
}

/**
 * Posts
 */
export class BlogPost {
    public id: number;
    public title: string;
    public createdat: moment.Moment;
    public collection: string[] = [];
    public tags: string[] = [];
}

// export class BlogCollectionSet {
//     public name: string;
//     public posts: BlogPost[] = [];
// }
// export class BlogDateSet {
//     public postdate: string;
//     public posts: BlogPost[] = [];
// }
