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

    get isValid(): boolean {
        if (this.title.length <= 0
            || this.author.length <= 0) {
            return false;
        }
        return true;
    }
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

    get isValid(): boolean {
        if (this.title.length <= 0
            || this.brief.length <= 0) {
            return false;
        }
        return true;
    }
}

/**
 * Blog utility
 */
export class BlogUtility {
    listCollection: Array<{
        name: string,
        count: number
    }> = [];
    listTag: Array<{
        name: string,
        count: number
    }> = [];
    listMonth: Array<{
        postdate: moment.Moment, // First day of Month
        count: number
    }> = [];

    public analyzePosts(posts: BlogPost[]) {
        this.listCollection = [];
        this.listTag = [];
        this.listMonth = [];

        posts.forEach(val => {
            if (val.createdat) {
                let mday = val.createdat.clone().startOf('M');
                const dtidx = this.listMonth.findIndex(dt => {
                    return dt.postdate.isSame(mday);
                });
                if (dtidx === -1) {
                    this.listMonth.push({
                        postdate: mday,
                        count: 1,
                    });
                } else {
                    this.listMonth[dtidx].count++;
                }
            }
            if (val.tags && val.tags.length > 0) {
                val.tags.forEach(tag => {
                    const cidx = this.listTag.findIndex(ctg => {
                        return tag === ctg.name;
                    });
                    if (cidx === -1) {
                        this.listTag.push({
                            name: tag,
                            count: 1
                        });
                    } else {
                        this.listTag[cidx].count++;
                    }
                });
            }
            if (val.collection && val.collection.length > 0) {
                val.collection.forEach(col => {
                    const cidx = this.listCollection.findIndex(coll => {
                        return col === coll.name;
                    });
                    if (cidx === -1) {
                        this.listCollection.push({
                            name: col,
                            count: 1
                        });
                    } else {
                        this.listCollection[cidx].count++;
                    }
                });
            }
        });
    }
}
