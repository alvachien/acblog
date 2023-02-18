import * as moment from 'moment';

/**
 * Setting
 */
export class BlogSetting {
    public title = '';
    public footer = '';
    public author = '';
    public authordesp = '';
    public authorimg = '';
}

/**
 * Posts
 */
export class BlogPost {
    public id = -1;
    public title = '';
    public brief = '';
    public createdat: moment.Moment = moment();
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
