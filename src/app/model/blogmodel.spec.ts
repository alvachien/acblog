import * as moment from "moment";
import { BlogPost, BlogSetting, BlogUtility } from "./blogmodel";

describe('BlogSetting', () => {
    let setting: BlogSetting;

    beforeEach(() => {
        setting = new BlogSetting();
    });
    
    it('shall create', () => {
        expect(setting).toBeDefined();

        // Default values
        expect(setting.author).toEqual('');
        expect(setting.authordesp).toEqual('');
        expect(setting.authorimg).toEqual('');
        expect(setting.footer).toEqual('');
        expect(setting.title).toEqual('');

        expect(setting.isValid).toBeFalse();
    });

    it('invalid case 1', () => {
        setting.title = '111';
        expect(setting.isValid).toBeFalse();
    });

    it('invalid case 2', () => {
        setting.author = 'aaa';
        expect(setting.isValid).toBeFalse();
    });

    it('valid case', () => {
        setting.title = '111';
        setting.author = 'aaa';
        expect(setting.isValid).toBeTrue();
    });
});

describe('BlogPost', () => {
    let post: BlogPost;

    beforeEach(() => {
        post = new BlogPost();
    });

    it('shall create', () => {
        expect(post).toBeDefined();

        // Default values
        expect(post.brief).toEqual('');
        expect(post.collection.length).toEqual(0);
        expect(post.createdat).toBeTruthy();
        expect(post.id).toEqual(-1);
        expect(post.tags.length).toEqual(0);
        expect(post.title).toEqual('');

        expect(post.isValid).toBeFalse();
    });

    it('invalid case 1', () => {
        post.brief = 'aaa';
        expect(post.isValid).toBeFalse();
    });

    it('invalid case 2', () => {
        post.title = 'aaa';
        expect(post.isValid).toBeFalse();
    });

    it('valid case', () => {
        post.brief = 'aaa';
        post.title = 'aaa';
        expect(post.isValid).toBeTrue();
    });
});

describe('BlogUtility', () => {
    let util: BlogUtility;

    beforeEach(() => {
        util = new BlogUtility();
    });

    it('create success', () => {
        expect(util).toBeDefined();

        expect(util.listCollection.length).toEqual(0);
        expect(util.listMonth.length).toEqual(0);
        expect(util.listTag.length).toEqual(0);
    });

    it('analyze post', () => {
        let post1 = new BlogPost();
        post1.brief = 'aaa';
        post1.collection = ['coll1', 'coll2'];
        post1.id = 1;
        post1.tags = ['tag1'];
        post1.title = 'Title 1';
        post1.createdat = moment('2022-01-01');

        let post2 = new BlogPost();
        post2.brief = 'aaa';
        post2.collection = ['coll2', 'coll3'];
        post2.id = 2;
        post2.tags = ['tag2', 'tag3'];
        post2.title = 'Title 2';
        post2.createdat = moment('2022-01-11');

        let post3 = new BlogPost();
        post3.brief = 'aaa';
        post3.collection = ['coll4'];
        post3.id = 3;
        post3.tags = ['tag5', 'tag4'];
        post3.title = 'Title 3';
        post3.createdat = moment('2022-02-11');

        let posts = [post1, post2, post3];
        util.analyzePosts(posts);
        expect(util.listCollection.length).toEqual(4);
        expect(util.listMonth.length).toEqual(2);
        expect(util.listTag.length).toEqual(5);
    });
});
